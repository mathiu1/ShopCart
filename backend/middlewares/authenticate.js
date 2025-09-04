const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  console.log("isAuthenticatedUser");
  console.log(req.cookies);

  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Login First", 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decode.id);
  await User.findByIdAndUpdate(decode.id, { lastSeen: Date.now() });
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`Role ${req.user.role} not allowed`, 401));
    }
    next();
  };
};
