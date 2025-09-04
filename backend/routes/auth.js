const express = require("express");





const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyOtp,
  resendOtp,
} = require("../controllers/authController");
const {isAuthenticatedUser, authorizeRoles} =require("../middlewares/authenticate");
const { upload } = require("../utils/filesUploads");

const router = express.Router();

router.route("/register").post(upload.single('avatar'),registerUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/resend-otp").post(resendOtp);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/myprofile").get(isAuthenticatedUser,getUserProfile);
router.route("/password/change").put(isAuthenticatedUser,changePassword);
router.route("/update").put(isAuthenticatedUser,upload.single('avatar'),updateProfile );



//Admin Routes
 router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'), getAllUsers);
 router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles('admin'), getUser)
                                 .put(isAuthenticatedUser,authorizeRoles('admin'), updateUser)
                                 .delete(isAuthenticatedUser,authorizeRoles('admin'), deleteUser);

                                 
module.exports = router;
