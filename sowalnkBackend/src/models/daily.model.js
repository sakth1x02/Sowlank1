import mongoose from "mongoose";

const dailyTaskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
      minlength: [3, "Task name must be at least 3 characters long"],
      maxlength: [100, "Task name must be less than 100 characters"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"], // Example priorities
      required: [true, "Priority is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      validate: {
        validator: function (v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v); // Validates HH:mm format
        },
        message: "Start time must be in HH:mm format",
      },
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
      validate: {
        validator: function (v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v); // Validates HH:mm format
        },
        message: "End time must be in HH:mm format",
      },
    },
    date: {
      type: String,
      default: "",
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot exceed 100"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    proofOfWork: {
      type: String,
      default: "",
    },
    hasExceededTime: {
      type: Boolean,
      default: false,
    },
    pointsAwarded: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timeseries: true,
  }
);

export const DailyTask = mongoose.model("DailyTask", dailyTaskSchema);
