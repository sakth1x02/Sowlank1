import mongoose from "mongoose";

const yearlyTaskSchema = new mongoose.Schema(
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
      enum: ["low", "medium", "high"],
      required: [true, "Priority is required"],
    },
    startDate: {
      type: String,
      required: [true, "Start Date is required"],
      default: "",
    },
    endDate: {
      type: String,
      required: [true, "End Date is required"],
      default: "",
    },
    dateOnCreated: {
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

export const yearlyTask = mongoose.model("YearlyTask", yearlyTaskSchema);
