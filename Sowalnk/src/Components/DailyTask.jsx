import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  addTask,
  toggleTaskCompletion,
  deleteTask,
  toggleHasExceededTime,
} from "../store/task-slice";

import {
  calculateTaskProgress,
  setDailyTaskProofWork,
} from "../store/task-slice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { increaseNormalCoins } from "../store/user-slice";

function DailyTask() {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [yesterdaysTasks, setYesterdaysTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const dispatch = useDispatch();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const navigate = useNavigate();

  const { dailyTask } = useSelector((state) => state.task);
  const { weeklyTask } = useSelector((state) => state.weekly);
  const { loggedInUser } = useSelector((state) => state.user);
  const { intermediateMember } = useSelector((store) => store.ui);

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedYesterday = yesterday.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleAddTask = async () => {
    if (taskName.trim() === "" || !startTime || !endTime || !priority) {
      console.error("Missing required fields");
      return;
    }

    if (
      dailyTask.some(
        (task) => task.taskName.toLowerCase() === taskName.trim().toLowerCase()
      ) ||
      weeklyTask.some(
        (task) => task.taskName.toLowerCase() === taskName.trim().toLowerCase()
      )
    ) {
      alert("This task already exists!");
      resetForm();
      return;
    }

    const newTask = {
      taskName,
      priority: priority.toLowerCase(),
      startTime,
      endTime,
      date: today,
      progress: 0,
      isCompleted: false,
      proofOfWork: "",
      hasExceededTime: false,
    };
    dispatch(addTask(newTask));
    resetForm();
  };

  const resetForm = () => {
    setTaskName("");
    setPriority("");
    setStartTime("");
    setEndTime("");
  };

  const handleFileChange = async (taskId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`/api/v1/task/daily/${taskId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setDailyTaskProofWork({ taskId, fileURL: data.proofOfWork }));
      } else {
        console.error("Failed to upload file");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };
  const getProgressColor = (progress, isCompleted, hasExceededTime) => {
    // Handle completed tasks
    if (isCompleted) {
      return "#4CAF50"; // Green
    }

    // Handle exceeded time
    if (hasExceededTime) {
      return "#FF0000"; // Red
    }

    // Handle in-progress tasks
    const validProgress = Math.min(Math.max(0, Number(progress) || 0), 100);
    if (validProgress < 25) return "#FA4032";
    if (validProgress < 50) return "#FC7033";
    if (validProgress < 75) return "#FFA33C";
    return "#6DA951";
  };

  const toggleCompletionHandler = async (task) => {
    // Early return if proofOfWork is empty
    if (task.proofOfWork === "") {
      return;
    }

    try {
      // Toggle task completion
      await dispatch(toggleTaskCompletion(task._id)).unwrap();
      toast.success(`Task "${task.taskName}" completed successfully! 🎉`);

      // Increase coins
      await dispatch(
        increaseNormalCoins({
          userId: loggedInUser._id,
          taskId: task._id,
        })
      ).unwrap();
      toast.success("Coins increased successfully! 🪙");
    } catch (error) {
      // Specific error messages
      if (error.message.includes("toggleTaskCompletion")) {
        toast.error("Failed to complete task");
      } else if (error.message.includes("increaseNormalCoins")) {
        toast.error("Failed to increase coins");
      } else {
        toast.error("An unexpected error occurred");
      }

      // Log the error for debugging
      console.error("Error in toggleCompletionHandler:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dailyTask.forEach((task) => {
        if (!task.isCompleted && !task.hasExceededTime) {
          checkIfTaskExceededTime(task);
        }
      });
      dispatch(calculateTaskProgress());
    }, 1000);

    return () => clearInterval(interval);
  }, [dailyTask]);

  const handleDelete = async (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const checkIfTaskExceededTime = async (task) => {
    if (!task?.endTime || task?.isCompleted || task?.hasExceededTime)
      return false;

    const currentTime = new Date();
    const [hours, minutes] = task.endTime.split(":");
    const taskEndTime = new Date();
    taskEndTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    const hasExceeded = taskEndTime < currentTime;

    if (hasExceeded && !task.hasExceededTime) {
      try {
        await dispatch(toggleHasExceededTime(task._id)).unwrap();
        toast.error(
          `Time exceeded for task "${task.taskName}"! ⏰ No Worry You can still complete it`
        );
        // Force refresh task data after exceeding time
        dispatch(fetchTasks());
      } catch (error) {
        console.error("Failed to update exceeded time status:", error);
      }
    }

    return hasExceeded;
  };

  useEffect(() => {
    const completedTasks = dailyTask.filter(
      (task) => task.isCompleted && task.date === formattedYesterday
    );
    setYesterdaysTasks(completedTasks || []);
  }, []);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const isTaskStarted = (task) => {
    const currentTime = new Date();
    const startTime = new Date(`${formattedDate} ${task?.startTime}`);
    return currentTime >= startTime;
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const Dashboard = ({ tasks }) => {
    return (
      <div className="p-5 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Daily Task Information</h2>
        <div>
          <p>Total Tasks: {tasks.length}</p>
          <p>
            Completed Tasks: {tasks.filter((task) => task?.isCompleted).length}
          </p>
          <p>
            Pending Tasks:{" "}
            {
              tasks.filter(
                (task) => !task?.isCompleted && !task?.hasExceededTime
              ).length
            }
          </p>
          <p>
            Incompleted Tasks:{" "}
            {tasks.filter((task) => task?.hasExceededTime).length}
          </p>
        </div>
      </div>
    );
  };
  const filteredTasks =
    selectedDate === ""
      ? dailyTask
      : dailyTask.filter((task) => task.date.split("T")[0] === selectedDate);

  const todaysTasks = dailyTask.filter(
    (task) => task.date.split("T")[0] === today.toISOString().split("T")[0]
  );
  const taskLimitReached = intermediateMember
    ? todaysTasks.length >= 20
    : todaysTasks.length >= 10;

  useEffect(() => {
    const hasNavigated = sessionStorage.getItem("hasNavigatedToPricing");
    if (taskLimitReached && !hasNavigated) {
      toast.error("You have reached the maximum number of tasks for today");
      sessionStorage.setItem("hasNavigatedToPricing", "true");
      navigate("/pricing");
    }
    if (!taskLimitReached) {
      sessionStorage.removeItem("hasNavigatedToPricing");
    }
  }, [todaysTasks, navigate]);

  return (
    <div className="min-h-screen ">
      <div className="max-w-md md:max-w-[90%]  md:mx-auto lg:mx-auto flex flex-col lg:flex-row lg:space-x-4 mb-6">
        <div className="w-full rounded-lg shadow-lg p-5 mb-4 lg:mb-0 bg-[#F0C1E1]">
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-semibold text-left mb-6"
              style={{ color: "#2e2e2e" }}
            >
              ✨ Daily Checklist
            </h1>
            <div className="flex items-center">
              <h1
                className="text-2xl font-semibold text-right pr-3 mb-6"
                style={{ color: "#2e2e2e" }}
              >
                Date:
              </h1>
              <h1 className="text-xl mb-5" style={{ color: "#2e2e2e" }}>
                {formattedDate}
              </h1>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={taskName || ""}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-3 border rounded-md border-gray-300"
              placeholder="Task Name"
            />
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="w-full lg:w-1/3">
                <label className="block text-black">Priority</label>
                <select
                  value={priority || ""}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">None</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-black">Start Time</label>
                <input
                  type="time"
                  value={startTime || ""}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-black">End Time</label>
                <input
                  type="time"
                  value={endTime || ""}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              onClick={handleAddTask}
              className={`w-full py-3 rounded-md bg-[#674188] text-white ${
                (
                  intermediateMember
                    ? todaysTasks.length >= 20
                    : todaysTasks.length >= 10
                )
                  ? "cursor-not-allowed"
                  : ""
              }`}
              disabled={
                intermediateMember
                  ? todaysTasks.length >= 20
                  : todaysTasks.length >= 10
              }
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div
        className="max-w-md md:max-w-[90%] md:mx-auto lg:mx-auto mb-6 p-6 rounded-lg"
        style={{ backgroundColor: "#F0C1E1" }}
      >
        <div className=" flex gap-6 justify-between items-start">
          <h2
            className="text-2xl font-semibold text-left"
            style={{ color: "#2e2e2e" }}
          >
            Today's Tasks
          </h2>
          <div className="flex gap-4">
            {
              <div className="mt-2 text-xl font-bold italic">
                {selectedDate === "" ? (
                  <p className="text-sm not-italic mt-1 hidden md:block">
                    Select Date For Particular Task's Data
                  </p>
                ) : (
                  new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                )}
              </div>
            }
            <input
              name="forfilter"
              type="date"
              className="rounded-lg mb-6 p-2"
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#674188] text-white">
                <th className="px-4 py-3">Task Name</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Start Time</th>
                <th className="px-4 py-3">End Time</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Completed</th>
                <th className="px-4 py-3">Proof of Work</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#F0C1E1]">
              {filteredTasks?.map((task, index) => (
                <tr
                  key={index}
                  className={`border-t ${
                    task?.isCompleted ? "bg-green-100" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 text-center text-black">
                    {task?.taskName}
                  </td>
                  <td className="px-4 py-2 text-center text-black">
                    {task?.priority}
                  </td>
                  <td className="px-4 py-2 text-center text-black">
                    {task?.startTime}
                  </td>
                  <td className="px-4 py-2 text-center text-black">
                    {task?.endTime}
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative w-[120%] h-6 rounded-full bg-gray-300 text-center">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${task?.progress}%`,
                          backgroundColor: getProgressColor(
                            task?.progress,
                            task?.isCompleted,
                            task?.hasExceededTime
                          ),
                        }}
                      ></div>
                      <span className="absolute right-2 top-1 text-xs font-semibold text-white">
                        {task?.progress === 100
                          ? task?.isCompleted
                            ? "Completed"
                            : "Incomplete"
                          : `${task?.progress}%`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={task.proofOfWork !== "" && task?.isCompleted}
                      onChange={() => toggleCompletionHandler(task)}
                      disabled={
                        task?.isCompleted ||
                        !isTaskStarted(task) ||
                        new Date() >
                          new Date(`${formattedDate} ${task?.endTime}`)
                      }
                      className={`${
                        task?.proofOfWork ? "" : "cursor-not-allowed"
                      }`}
                      style={{
                        transform: "scale(1.5)",
                      }}
                    />
                  </td>

                  <td className="pl-5 py-2 text-center flex gap-1">
                    {!task.proofOfWork && (
                      <input
                        name="proofwork"
                        type="file"
                        onChange={(e) =>
                          handleFileChange(task?._id, e.target.files[0])
                        }
                        disabled={task?.hasExceededTime}
                        className={`text-sm ${
                          task?.hasExceededTime ? "cursor-not-allowed" : ""
                        }`}
                        required
                      />
                    )}
                    {task?.proofOfWork && (
                      <a
                        href={task?.proofOfWork || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-sm"
                      >
                        View Proof
                      </a>
                    )}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(task?._id)}
                      className={`py-1 px-2 rounded-md bg-red-500 text-white ${
                        task?.hasExceededTime ? "cursor-not-allowed" : ""
                      }`}
                      disabled={task?.hasExceededTime}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="w-full text-center my-7">
              No Task Data is Present on this Date
            </div>
          )}
        </div>
      </div>
      <div
        className="max-w-md md:max-w-[90%] md:mx-auto lg:mx-auto mb-6"
        style={{ backgroundColor: "#F0C1E1" }}
      >
        <Dashboard tasks={filteredTasks} />
      </div>
    </div>
  );
}

export default DailyTask;
