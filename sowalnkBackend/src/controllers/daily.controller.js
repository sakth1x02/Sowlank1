import { DailyTask } from "../models/daily.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloud.js";
import fs from "fs";

const dailyTaskController = {
  createTask: asyncHandler(async (req, res) => {
    try {
      const { taskName, priority, startTime, endTime, date } = req.body;
      const userId = req.user._id; // Get user ID from authenticated request

      if (!taskName || !priority || !startTime || !endTime) {
        console.error("Missing required fields");
        throw new ApiError(400, "Missing required fields");
      }

      const existedData = await DailyTask.findOne({
        taskName: taskName.trim(),
        user: userId,
      });
      if (existedData) {
        console.error("This Data is Already existed");
        throw new ApiError(409, "This task already exists for this user");
      }

      const newTask = new DailyTask({
        taskName,
        priority,
        startTime,
        endTime,
        date,
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

  // Get all tasks
  getAllTasks: asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const tasks = await DailyTask.find({ user: userId });
      res.status(200).json(tasks);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching tasks", error: error.message });
      //here i resolve issue because the apiResponse utility i used i think there is some issue....
    }
  }),

  // Toggle task completion status
  toggleTaskCompletion: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await DailyTask.findOne({ _id: id, user: userId });

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    task.isCompleted = !task.isCompleted;
    task.progress = task.isCompleted ? 100 : 0;
    await task.save();

    res.status(200).json(task);
  }),
  // toggle hasExceededTime status
  toggleHasExceededTime: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    const task = await DailyTask.findOne({ _id: id, user: userId });
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    task.hasExceededTime = !task.hasExceededTime;
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
      const task = await DailyTask.findOne({ _id: id, user: userId });
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

  // // Get a task by ID
  // getTaskById: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const task = await DailyTask.findById(id);

  //     if (!task) {
  //       return res.status(404).json({ message: "Task not found" });
  //     }

  //     res.status(200).json(task);
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Error fetching task", error: error.message });
  //   }
  // },

  // // Update a task by ID
  // updateTask: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const updatedTask = await DailyTask.findByIdAndUpdate(id, req.body, {
  //       new: true,
  //       runValidators: true,
  //     });

  //     if (!updatedTask) {
  //       return res.status(404).json({ message: "Task not found" });
  //     }

  //     res
  //       .status(200)
  //       .json({ message: "Task updated successfully", task: updatedTask });
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Error updating task", error: error.message });
  //   }
  // },

  // // Delete a task by ID
  deleteTask: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const deletedTask = await DailyTask.findOneAndDelete({
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

export { dailyTaskController };
