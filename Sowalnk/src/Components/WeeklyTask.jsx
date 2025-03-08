import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchWeeklyTasks,
  addWeeklyTask,
  toggleWeeklyTaskCompletion,
  deleteWeeklyTask,
} from "../store/weekly-slice";

import {
  calculateWeeklyTaskProgress,
  setWeeklyTaskProofWork,
} from "../store/weekly-slice";

import { toast } from "react-toastify";
import { increaseGoldCoins } from "../store/user-slice.jsx";

function WeeklyTask() {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { dailyTask } = useSelector((state) => state.task);
  const { weeklyTask } = useSelector((state) => state.weekly);
  const { loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay());
  firstDayOfWeek.setHours(0, 0, 0, 0);
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Calculate week number
  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1); // First day of the year
    const daysSinceStart = Math.floor(
      (date - startOfYear) / (1000 * 60 * 60 * 24)
    );
    return Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7); // Calculate week number
  };
  const currentWeekNumber = getWeekNumber(today);

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  const formattedStartOfWeek = firstDayOfWeek.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedEndOfWeek = lastDayOfWeek.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Effect to set endDate to the end of the week when startDate changes
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      const endOfWeek = new Date(start);
      endOfWeek.setDate(start.getDate() + (6 - start.getDay())); // Set to Sunday
      setEndDate(endOfWeek.toISOString().split("T")[0]);
    }
  }, [startDate]);

  const handleAddTask = () => {
    if (!taskName || !priority || !startDate || !endDate) {
      alert("Please fill out all fields.");
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < today) {
      alert("Start date cannot be before today.");
      return;
    }

    if (start > end) {
      alert("Start date cannot be later than the end date.");
      return;
    }
    if (
      weeklyTask.some(
        (task) => task.taskName.toLowerCase() === taskName.trim().toLowerCase()
      ) ||
      dailyTask.some(
        (task) =>
          task.taskName.toLowerCase() === taskName.trim().toLocaleLowerCase()
      )
    ) {
      alert("This task already exists!");
      resetForm();
      return;
    }
    const newTask = {
      taskName,
      priority: priority.toLowerCase(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      dateOnCreated: today,
      progress: 0,
      isCompleted: false,
      proofOfWork: "",
      hasExceededTime: false,
    };

    dispatch(addWeeklyTask(newTask));
    resetForm();
  };

  const resetForm = () => {
    setTaskName("");
    setPriority("");
    setStartDate("");
    setEndDate("");
  };

  const toggleCompletion = async (task) => {
    if (task.proofOfWork === "") {
      return;
    }
    try {
      await dispatch(toggleWeeklyTaskCompletion(task._id)).unwrap();
      toast.success(`Task "${task.taskName}" completed successfully! 🎉`);
      await dispatch(
        increaseGoldCoins({
          userId: loggedInUser._id,
          taskId: task._id,
        })
      ).unwrap();
      toast.success("Gold Coins increased successfully! 💰");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to complete task");
    }
  };

  const handleDelete = (taskId) => {
    dispatch(deleteWeeklyTask(taskId));
  };

  // const handleFileChange = async (taskId, file) => {
  //   if (!file) return;
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     const response = await fetch(
  //       `http://localhost:1000/api/v1/weeklytask/weekly/${taskId}/upload`,
  //       {
  //         method: "POST",
  //         credentials: "include",
  //         body: formData,
  //       }
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       dispatch(setWeeklyTaskProofWork({ taskId, fileURL: data.proofOfWork }));
  //     } else {
  //       console.error("Failed to upload file");
  //     }
  //   } catch (err) {
  //     console.error("Error uploading file:", err);
  //   }
  // };

  const weeklyTasks = useMemo(
    () =>
      weeklyTask.filter((task) => {
        const taskStartDate = new Date(task.startDate);
        const taskEndDate = new Date(task.endDate);
        return taskStartDate <= lastDayOfWeek && taskEndDate >= firstDayOfWeek;
      }),
    [weeklyTask, firstDayOfWeek, lastDayOfWeek]
  );

  const getProgressBarColor = (progress) => {
    if (progress <= 25) return "#6DA951";
    if (progress <= 50) return "#4CAF50";
    if (progress <= 75) return "#FFA33C";
    if (progress < 100) return "#FC7033";
    return "#6DA951";
  };

  // const checkIfTaskExceededTime = (task) => {
  //   const taskEndTime = new Date(`${formattedDate} ${task?.endDate}`);
  //   const currentTime = new Date();

  //   return taskEndTime < currentTime && !task?.isCompleted;
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(calculateWeeklyTaskProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(fetchWeeklyTasks());
  }, [dispatch]);

  const Dashboard = () => {
    const totalTask = Math.floor(dailyTask.length / 7);
    const completedTask = Math.floor(
      dailyTask.filter((task) => task.isCompleted).length / 7
    );
    const pendingTask = Math.floor(
      dailyTask.filter((task) => !task.isCompleted).length / 7
    );
    return (
      <div className="p-5 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Weekly Task Information</h2>
        <div className="space-y-5">
          <div className="p-2 mt-5">
            <p>Total Tasks: {totalTask}</p>
            <p>Completed Tasks: {completedTask}</p>
            <p>Pending Tasks: {pendingTask}</p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md md:max-w-4xl lg:mx-auto md:flex space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="md:w-2/3 rounded-lg shadow-lg p-5 bg-[#F0C1E1]">
          <h1 className="text-2xl font-semibold text-center mb-4 text-[#2e2e2e]">
            Weekly Checklist
          </h1>
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-xl font-semibold text-[#2e2e2e]">
              Week {Math.ceil(currentWeekNumber / 6)} : {formattedStartOfWeek} -{" "}
              {formattedEndOfWeek}
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-3 border rounded-md border-gray-300"
              placeholder="Task Name"
            />
            <div className="flex space-x-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-1/3 p-3 border rounded-md"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-1/3 p-3 border rounded-md"
                min={firstDayOfWeek.toISOString().split("T")[0]}
                max={lastDayOfWeek.toISOString().split("T")[0]}
              />
              {/* <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-1/3 p-3 border rounded-md"
              /> */}
            </div>
            <button
              onClick={handleAddTask}
              className="w-full py-3 rounded-md bg-[#674188] text-white hover:bg-[#563177] transition-colors"
              disabled={!taskName || !priority || !startDate || !endDate}
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="md:w-1/3 rounded-lg shadow-lg p-5 bg-[#F0C1E1]">
          <h2 className="text-xl font-semibold mb-4 text-[#3d3d3d]">
            Tasks This Week
          </h2>
          <ul className="space-y-4">
            {weeklyTasks.map((task) => (
              <li key={task._id} className="p-3 rounded-lg bg-white">
                <span className="mr-4">{task.taskName}</span>
                <button
                  onClick={() => toggleCompletion(task)}
                  className={`${
                    task.isCompleted
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-gray-400"
                  } text-white py-1 px-4 rounded`}
                  disabled={task.isCompleted}
                >
                  {task.isCompleted ? "Completed" : "Incomplete"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="my-6 max-w-md md:max-w-4xl lg:mx-auto rounded-lg shadow-lg p-6 bg-[#F0C1E1]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-[#674188] text-white">
                <th className="px-4 py-3">Task Name</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {weeklyTasks.map((task) => (
                <tr key={task._id} className="border-t">
                  <td className="px-4 py-2 text-center">{task.taskName}</td>
                  <td className="px-4 py-2 text-center">{task.priority}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(task.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(task.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative w-full h-6 rounded-full bg-gray-300">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${task.progress}%`,
                          backgroundColor: getProgressBarColor(task.progress),
                        }}
                      ></div>
                      <span className="absolute inset-x-2 text-xs text-white">
                        {task.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-[#FC7033] text-white py-1 px-3 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="max-w-4xl mx-auto mb-6"
        style={{ backgroundColor: "#F0C1E1" }}
      >
        <Dashboard />
      </div>
    </div>
  );
}

export default WeeklyTask;
