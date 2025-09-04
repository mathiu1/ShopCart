const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");



// Register User - api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  let avatar;
  if (req.file) {
    avatar = `${req.protocol}://${req.get("host")}/uploads/user/${
      req.file.newName
    }`;
  }

  let user = await User.findOne({ email });

  if (user) {
    if (!user.isVerified) {
      // If OTP expired → regenerate
      if (user.otpExpire < Date.now()) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000;
        user.avatar = avatar;
        await user.save();

        await sendEmail({
          email,
          subject: "New Verify OTP For Your Email ",
          type: "otp",
          otp,
        });

        return res.status(200).json({
          success: true,
          email,
          message: "Previous OTP expired. New OTP sent to your email.",
        });
      }

      return res.status(200).json({
        success: true,
        email,
        message:
          "Already registered but not verified. Please check your email for OTP.",
      });
    }

    return next(
      new ErrorHandler("User already exists and verified. Please login.", 400)
    );
  }

  // New User

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user = await User.create({
    name,
    email,
    password,
    avatar,
    otp,
    otpExpire: Date.now() + 5 * 60 * 1000, // 5 mins expiry
  });

  await sendEmail({
    email,
    subject: "Verify Your Email - OTP",
    type: "otp",
    otp,
  });

  res.status(201).json({
    success: true,
    email,
    message: "Registered successfully. Please verify OTP sent to your email.",
  });
});

// Verify OTP - api/v1/verify-otp
exports.verifyOtp = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;
  console.log(req.body);

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.isVerified)
    return next(new ErrorHandler("User already verified", 400));

  if (user.otp !== otp || user.otpExpire < Date.now()) {
    return next(new ErrorHandler("Invalid or expired OTP ", 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpire = undefined;
  user.lastSeen = Date.now();
  await user.save();

  //  Now login with your existing sendToken method
  sendToken(user, 200, res);
});

// Resend OTP - api/v1/resend-otp
exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.isVerified) {
      return next(new ErrorHandler("User already verified. please login", 400));
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // ⏳ 5 minutes
    await user.save();

    // Send OTP email
    await sendEmail({
      email: user.email,
      subject: "Resend OTP - Verify Your Email",
      type: "otp", // <-- uses otp_template.html
      otp,
    });

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email.",
    });
  } catch (err) {
    console.error(" Error in resendOtp:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Login User- api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email And Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email And Password", 401));
  }

  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid Email And Password", 401));
  }
  user.lastSeen = Date.now();
  await user.save({ validateBeforeSave: false });
  sendToken(user, 201, res);
});

//Logout User - api/v1/logout
exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Logout success",
    });
};

// Forgot Pass - api/v1/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const resetToken = user.getResetToken();

  await user.save({ validateBeforeSave: false });

  //Create reset url

let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV === "Production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

  
  const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

  const message = `Your password reset url is as follows \n\n 
    ${resetUrl} \n\n If you have not requested this email, then ignore it.`;

  try {
    

    await sendEmail({
      email: user.email,
      subject: "ShopCart Password Recovery",
      type: "reset",
      token: resetUrl,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message), 500);
  }
});

//Reset Password - /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorHandler("Password reset token is invalid or expired"));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match"));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });
  sendToken(user, 201, res);
});

//Get User Profile - api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.lastSeen = Date.now();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    user,
    isAuthenticated: user.isVerified,
  });
});

//Change Password-api/v1/password/change
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //check old password
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new ErrorHandler("Old Password is incorrect", 401));
  }

  //assign New Password
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

//Update Profile-
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  let avatar = req.user.avatar;

  if (req.file) {
    avatar = `${req.protocol}://${req.host}/uploads/user/${req.file.newName}`;
    if (req.user.avatar) {
      const parts = req.user.avatar.split("/");
      const filename = parts[parts.length - 1];

      const oldPath = path.join(__dirname, "..", "/uploads/user/", filename);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
  }
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    avatar: avatar,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin Get All User -
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

//Admin Get Single User
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 401));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin : Update User

exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  if (req.user._id == req.params.id)
    return next(new ErrorHandler("You Can't Change Your Role", 401));

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin :Delete User
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User Not Found", 401));
  }

  await user.deleteOne();
  res.status(200).json({
    success: true,
  });
});
