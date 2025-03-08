import { yearlyTask } from "../models/yearly.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloud.js";
import fs from "fs";

const yearlyTaskController = {
  createTask: asyncHandler(async (req, res) => {
    try {
      const { taskName, priority, startDate, endDate, dateOnCreated } =
        req.body;
      const userId = req.user._id; // Get user ID from authenticated request

      if (!taskName || !priority || !startDate || !endDate) {
        throw new ApiError(400, "Missing required fields");
      }

      const existedData = await yearlyTask.findOne({
        taskName: taskName.trim(),
        user: userId,
      });

      if (existedData) {
        throw new ApiError(409, "This task already exists for this user");
      }

      const newTask = new yearlyTask({
        taskName,
        priority,
        startDate,
        endDate,
        dateOnCreated,
        user: userId,
      });

      await newTask.save();
      res.status(200).json(newTask);
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ message: "Validation failed", errors });
      } else {
        res
          .status(500)
          .json({ message: "Error creating task", error: error.message });
      }
    }
  }),

  getAllTasks: asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const tasks = await yearlyTask.find({ user: userId });
      res.status(200).json(tasks);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching tasks", error: error.message });
    }
  }),

  toggleTaskCompletion: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await yearlyTask.findOne({ _id: id, user: userId });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    task.isCompleted = !task.isCompleted;
    task.progress = task.isCompleted ? 100 : 0;
    await task.save();

    res.status(200).json(task);
  }),

  uploadFileController: asyncHandler(async (req, res) => {
    const file = req.file;
    const { id } = req.params;
    const userId = req.user._id;

    if (!file) {
      throw new ApiError(400, "Image Proof is Not Found");
    }

    try {
      const task = await yearlyTask.findOne({ _id: id, user: userId });
      if (!task) {
        throw new ApiError(404, "Task not found");
      }

      const uploadResult = await uploadOnCloudinary(file.path);
      fs.unlinkSync(file.path);

      if (!uploadResult) {
        return res.status(500).json({ message: "Upload to Cloudinary failed" });
      }

      task.proofOfWork = uploadResult.url;
      await task.save();

      res.status(200).json(task);
    } catch (err) {
      console.error("Error uploading file:", err);
      res.status(500).json({ message: "File upload failed" });
    }
  }),

  deleteTask: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const deletedTask = await yearlyTask.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedTask) {
      throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });
  }),
};

export { yearlyTaskController };
