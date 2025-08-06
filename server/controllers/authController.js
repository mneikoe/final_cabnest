const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const sendEmail = require("../utils/email");
const logger = require("../utils/logger");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register
exports.registerUser = async (req, res, next) => {
  logger.info("Register attempt: %s", req.body.email);
  try {
    const { email } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn("Registration failed - user exists: %s", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create(req.body);

    logger.info(
      "User registered successfully: %s (id: %s)",
      user.email,
      user._id
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      remainingRides: user.remainingRides,
      isEmailVerified: user.isEmailVerified,
      token: generateToken(user._id),
    });
  } catch (error) {
    logger.error("Registration error: %s", error.stack);
    next(error);
  }
};

// Login
exports.loginUser = async (req, res, next) => {
  logger.info("Login attempt: %s", req.body.email);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      logger.info("Login success: %s (id: %s)", user.email, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        remainingRides:
          user.role === "student" ? user.remainingRides : undefined,
        token: generateToken(user._id),
      });
    } else {
      logger.warn("Login failed (invalid credentials): %s", email);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    logger.error("Login error: %s", error.stack);
    next(error);
  }
};

// Google OAuth Login
exports.googleLogin = async (req, res, next) => {
  logger.info("Google login attempt");
  try {
    const { tokenId } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      logger.info("Creating new Google user: %s", email);
      user = await User.create({
        name,
        email,
        password: email + Math.random().toString(36).slice(-8),
        isEmailVerified: true,
      });
    } else if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
      logger.info("Google user email verified updated: %s", email);
    }

    const token = generateToken(user._id);
    logger.info("Google login success: %s (id: %s)", user.email, user._id);

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone || null,
      },
    });
  } catch (err) {
    logger.error("Google login error: %s", err.stack);
    next(err);
  }
};

// Send verification email
exports.sendVerificationEmail = async (req, res, next) => {
  logger.info("Send verification email request for user id: %s", req.user._id);
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      logger.warn("User not found for sendVerificationEmail: %s", req.user._id);
      return next(new Error("User not found"));
    }
    if (user.isEmailVerified) {
      logger.warn("User email already verified: %s", user.email);
      return next(new Error("Email already verified"));
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h

    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    logger.info(
      "Sending verification email to %s with URL %s",
      user.email,
      verificationUrl
    );

    await sendEmail({
      email: user.email,
      subject: "Verify your Email",
      message: `Click the link to verify your email: ${verificationUrl}`,
      buttonText: "Verify Email",
      link: verificationUrl,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    logger.error("Send verification email error: %s", err.stack);
    next(err);
  }
};

// Verify Email
exports.verifyEmail = async (req, res, next) => {
  const token = req.params.token;
  logger.info("Verify email attempt with token: %s", token);
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    logger.debug("Token hashed to: %s", hashedToken);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn("Verify email failed - token invalid or expired");
      return next(new Error("Token invalid or expired"));
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    logger.info(
      "Email verified successfully for user %s (id: %s)",
      user.email,
      user._id
    );

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    logger.error("Verify email error: %s", err.stack);
    next(err);
  }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  logger.info("Forgot password request for email: %s", req.body.email);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      logger.warn(
        "Forgot password failed - no user with email: %s",
        req.body.email
      );
      return next(new Error("No user found with that email"));
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    logger.info(
      "Sending password reset email to %s with URL %s",
      user.email,
      resetUrl
    );

    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message: `Reset your password using this link: ${resetUrl}`,
      buttonText: "Reset Password",
      link: resetUrl,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    logger.error("Forgot password error: %s", err.stack);
    next(err);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  const token = req.params.token;
  logger.info("Reset password attempt with token: %s", token);
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    logger.debug("Token hashed to: %s", hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      logger.warn("Reset password failed - invalid or expired token");
      return next(new Error("Token invalid or expired"));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    logger.info(
      "Password reset successful for user %s (id: %s)",
      user.email,
      user._id
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    logger.error("Reset password error: %s", err.stack);
    next(err);
  }
};

// Get User Profile
exports.getUserProfile = async (req, res, next) => {
  logger.info("Profile fetch for user id: %s", req.user._id);
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      logger.warn("Profile fetch failed - user not found: %s", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      location: user.location,
      remainingRides: user.role === "student" ? user.remainingRides : undefined,
    });
  } catch (err) {
    logger.error("Profile fetch error: %s", err.stack);
    next(err);
  }
};
