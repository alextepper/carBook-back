const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createToken } = require("../utils/generateToken");
const apiError = require("../utils/apiError");
const sendEmail = require("../utils/emailSender");

// @desc Sign Up
exports.signup = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Create the user
  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
  });

  if (user) {
    res.status(201).json({ token: createToken(user._id), data: user });
  }
});

// @desc Login
exports.login = asyncHandler(async (req, res, next) => {
  //  check if password and email in the body (validation)
  //  check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new apiError("Invalid Password or Email", 401));
  }
  if (user.isBlocked) {
    return next(new apiError("Your Account has been disabled", 403));
  }
  //  Create Token
  const token = createToken(user._id);

  //  Delete password from response
  delete user._doc.password;

  //  Send response to client side
  res.status(200).json({ token, data: user });
});

// Forgot Password
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new apiError("There is no user with that email", 404));
  }

  // Create reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the reset token and save the hashed version in the database
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save the hashed token and expiry time in the database
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 4 * 60 * 60 * 1000; // Token valid for 10 minutes
  await user.save();

  // Send an email to user with the token
  const resetURL = `${req.protocol}://${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the following link or ignore the message: \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new apiError("Email could not be sent", 500));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new apiError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, data: "Password reset successful" });
});
