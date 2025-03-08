import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    authMethod: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    password: {
      type: String,
      required: function () {
        return this.authMethod === "email";
      },
      validate: {
        validator: function (v) {
          // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
          if (this.authMethod !== "email") return true;
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v);
        },
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.authMethod === "email";
      },
      default: null, // Changed from ""
      unique: true,
      sparse: true,
      validate: {
        validator: function (v) {
          // Ensure phone is validated only when authMethod is "email"
          if (this.authMethod !== "email") return true;
          return v !== null && /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: "Invalid phone number format",
      },
    },
    positivePoints: {
      type: Number,
      default: 10,
    },
    negativePoints: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastTaskDate: {
      type: Date,
      default: null,
    },
    totalPoints: {
      type: Number,
      default: 10,
    },
    normalCoins: {
      type: Number,
      default: 1,
    },
    goldCoins: {
      type: Number,
      default: 1,
    },
    eliteCoins: {
      type: Number,
      default: 1,
    },
    couponCards: {
      type: [String],
      default: [],
    },
    goldCouponCards: {
      type: [String],
      default: [],
    },
    eliteCouponCards: {
      type: [String],
      default: [],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.totalPoints = Math.max(0, this.positivePoints - this.negativePoints);
  next();
});

export const User = mongoose.model("User", userSchema);
