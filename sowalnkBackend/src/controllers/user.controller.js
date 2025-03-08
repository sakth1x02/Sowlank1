import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { DailyTask } from "../models/daily.model.js";
import { weeklyTask } from "../models/weekly.model.js";
import { yearlyTask } from "../models/yearly.model.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import crypto from "crypto";

// Helper function to generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Update cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Only use secure in production
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const userAuthentication = {
  signupUser: asyncHandler(async (req, res) => {
    // Step 1: Extract user details from the request body
    const { name, email, password, confirmPassword, phone } = req.body;

    // Step 2: Validate required fields
    if (
      [name, email, password, confirmPassword, phone].some(
        (field) => !field?.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password are not same",
      });
    }

    // Step 3: Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User with this email already exists try google login or forget passowrd",
      });
    }

    // Step 4: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Step 5: Create the user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // Generate token
    const token = generateAccessToken(user._id);
    await sendVerificationEmail(user.email, verificationToken);

    // Step 6: Remove the password from the response
    const createdUser = await User.findById(user._id).select("-password");

    // Set cookie and send response with token
    res.cookie("token", token, cookieOptions);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: createdUser,
      token,
    });
  }),
  verifyEmail: asyncHandler(async (req, res) => {
    const { verificationCode } = req.body;
    try {
      const user = await User.findOne({
        verificationToken: verificationCode,
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification code",
        });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();

      await sendWelcomeEmail(user.email, user.name);

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      console.log("error in verifyEmail ", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }),
  // Add to userAuthentication object in user.controller.js
  googleAuth: asyncHandler(async (req, res) => {
    const { email, name } = req.body;

    // Check for existing user
    let user = await User.findOne({ email });

    // Create new user if not exists
    if (!user) {
      // const tempPassword = crypto.randomBytes(10).toString("hex"); // Generate random password
      // const hashedPassword = await bcrypt.hash(tempPassword, 10);

      user = await User.create({
        name,
        email,
        // password: hashedPassword,
        isVerified: true, // Skip email verification for Google users
        authMethod: "google", // Add this field to track auth method
      });
    }

    // Generate JWT token
    const token = generateAccessToken(user._id);
    const userData = await User.findById(user._id).select("-password");
    user.lastLogin = new Date();
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    // Return token and user data
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      data: userData,
      token,
    });
  }),

  loginUser: asyncHandler(async (req, res) => {
    // Step 1: Extract email and password from the request body
    const { email, password } = req.body;

    // Step 2: Validate required fields
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Step 3: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      // Step 4: Compare the provided password with the hashed password
      const isPasswordValid = bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
      }

      // Generate token
      const token = generateAccessToken(user._id);

      // Remove password from response
      const loggedInUser = await User.findById(user._id).select("-password");
      user.lastLogin = new Date();
      await user.save();

      // Set cookie and send response with token
      res.cookie("token", token, cookieOptions);
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: loggedInUser,
        token,
      });
    } else {
      throw new ApiError(401, "Invalid credentials");
    }
  }),

  logoutUser: asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  }),
  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;

      await user.save();

      // send email
      await sendPasswordResetEmail(
        user.email,
        `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`
      );

      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email",
      });
    } catch (error) {
      console.log("Error in forgotPassword ", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }),

  resetPassword: asyncHandler(async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired reset token" });
      }

      // update password
      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();

      await sendResetSuccessEmail(user.email);

      res
        .status(200)
        .json({ success: true, message: "Password reset successful" });
    } catch (error) {
      console.log("Error in resetPassword ", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }),

  // Protected route to get current user
  getCurrentUser: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({
      success: true,
      data: user,
    });
  }),

  //get all users
  getAllUsers: asyncHandler(async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ totalPoints: -1 })
        .lean();

      // Add position based on sorted order
      const usersWithPosition = users.map((user, index) => ({
        ...user,
        position: index + 1,
      }));

      res.status(200).json({ data: usersWithPosition });
    } catch (error) {
      res.status(500).json({
        message: "Error From Fetch All Users",
        error: error.message,
      });
    }
  }),

  updateTaskPoints: asyncHandler(async (req, res) => {
    const { userId, completed, taskId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Find and update the task
    const task = await DailyTask.findById(taskId);
    if (!task || task.pointsAwarded) {
      return res.status(200).json({
        success: true,
        message: "Points already awarded",
        data: user,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (completed) {
      user.positivePoints += 2;

      if (user.lastTaskDate) {
        const lastDate = new Date(user.lastTaskDate);
        lastDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.streak += 1;
          if (user.streak % 5 === 0) {
            user.positivePoints += 5;
          }
        } else if (diffDays > 1) {
          user.streak = 1;
        }
      } else {
        user.streak = 1;
      }

      user.lastTaskDate = today;
    } else {
      user.negativePoints += 2;
    }

    user.totalPoints = Math.max(0, user.positivePoints - user.negativePoints);

    task.pointsAwarded = true;
    await task.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Points updated successfully",
      data: user,
    });
  }),
  increaseNormalCoins: asyncHandler(async (req, res) => {
    const { userId, taskId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not Found");
    }

    const task = await DailyTask.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not Found");
    }

    if (task.isCompleted) {
      user.normalCoins += 1;
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "Normal Coins updated successfully",
      data: user,
    });
  }),
  increaseGoldCoins: asyncHandler(async (req, res) => {
    const { userId, taskId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not Found");
    }

    const task = await weeklyTask.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not Found");
    }

    if (task.isCompleted) {
      user.goldCoins += 1;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Gold Coins updated successfully",
      data: user,
    });
  }),
  increaseEliteCoins: asyncHandler(async (req, res) => {
    const { userId, taskId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not Found");
    }
    const task = await yearlyTask.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not Found");
    }
    if (task.isCompleted) {
      user.eliteCoins += 1;
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "Elite Coins updated successfully",
      data: user,
    });
  }),
  convertNormalCoinsToCoupon: asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const COUPON_COST = 5;

    if (user.normalCoins < COUPON_COST) {
      throw new ApiError(400, "Not enough normal coins to convert.");
    }

    if (user.couponCards.length >= 4) {
      throw new ApiError(400, "You can only have 4 coupons at a time!");
    }

    // Deduct coins and add a coupon card
    user.normalCoins -= COUPON_COST;
    user.couponCards.push(`Coupon Card ${user.couponCards.length + 1}`);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Coupon card generated successfully!",
      data: user,
    });
  }),
  convertGoldCoinsToCoupon: asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not Found");
    }
    const COUPON_COST = 5;
    if (user.goldCoins < COUPON_COST) {
      throw new ApiError(400, "Not enough gold coins to convert");
    }
    if (user.goldCouponCards.length >= 5)
      throw new ApiError(400, "You can only have 5 coupons at a time");

    //Deduct coins and add a coupon card
    user.goldCoins -= COUPON_COST;
    user.goldCouponCards.push(
      `Gold Coupon Card ${user.goldCouponCards.length + 1}`
    );

    await user.save();
    res.status(200).json({
      success: true,
      message: "Gold Coupon Card Generated Successfully",
      data: user,
    });
  }),

  convertEliteCoinsToCoupon: asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not Found");
    }
    const COUPON_COST = 5;
    if (user.eliteCoins < COUPON_COST) {
      throw new ApiError(400, "Not enough elite coins to convert");
    }
    if (user.eliteCouponCards.length >= 1) {
      throw new ApiError(400, "You can only have 1 elite coupon at a time");
    }

    //Deduct coins and add a coupon card
    user.eliteCoins -= COUPON_COST;
    user.eliteCouponCards.push(
      `₹1000 Discount Coupon ${user.eliteCouponCards.length + 1} for Food or Products`
    );

    await user.save();
    res.status(200).json({
      success: true,
      message: "Elite Coupon Card Generated Successfully",
      data: user,
    });
  }),
};

export { userAuthentication };
