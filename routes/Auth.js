const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("./../controllers/AuthCtr");
const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
} = require("./../utils/validators/authValidator");

// @desc Sign Up
router.post("/signup", signupValidator, signup);

// @desc Login
router.post("/login", loginValidator, login);

// @desc Forgot Password
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);

router.put("/reset-password/:token", resetPassword);

module.exports = router;
