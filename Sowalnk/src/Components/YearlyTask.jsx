import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchYearlyTasks,
  addYearlyTask,
  deleteYearlyTask,
  toggleYearlyTaskCompletion,
} from "../store/yearly-slice.jsx";

import { calculateYearlyTaskProgress } from "../store/yearly-slice.jsx";
import { toast } from "react-toastify";
import { increaseEliteCoins } from "../store/user-slice.jsx";

function YearlyTask() {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { yearlyTask } = useSelector((store) => store.yearly);
  const { loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateForInput = (date) => date.toISOString().split("T")[0];
  const formattedDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const validateDates = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setErrorMessage("Start date cannot be in the past.");
      return false;
    }

    if (endDate < startDate) {
      setErrorMessage("End date must be after the start date.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const getLastDayOfThiredMonth = (date) => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 4, 1);
    return lastDay;
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // Automatically set end date to last day of the month
    const startDateObj = new Date(newStartDate);
    const lastDay = getLastDayOfThiredMonth(startDateObj);
    setEndDate(formatDateForInput(lastDay));

    validateDates(newStartDate, formatDateForInput(lastDay));
  };

  const handleAddTask = () => {
    if (!taskName.trim() || !startDate || !endDate || !priority) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!validateDates(startDate, endDate)) {
      return;
    }

    const newTask = {
      taskName,
      priority: priority.toLowerCase(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      dateOnCreated: today,
      progress: 0,
      isCompleted,
      proofOfWork: "",
    };

    dispatch(addYearlyTask(newTask));
    resetForm();
  };

  const resetForm = () => {
    setTaskName("");
    setPriority("");
    setStartDate("");
    setEndDate("");
    setIsCompleted(false);
    setErrorMessage("");
  };

  const handleDelete = (taskId) => {
    dispatch(deleteYearlyTask(taskId));
  };

  const toggleCompletion = async (task) => {
    try {
      await dispatch(toggleYearlyTaskCompletion(task._id)).unwrap();
      toast.success(`Task "${task.taskName}" completed successfully! 🎉`);
      await dispatch(
        increaseEliteCoins({
          userId: loggedInUser._id,
          taskId: task._id,
        })
      ).unwrap();
      toast.success("Elite Coins increased successfully! 👑");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to complete task");
    }
  };

  const getProgressColor = (progress) => {
    if (progress <= 25) return "#6DA951";
    if (progress <= 50) return "#4CAF50";
    if (progress <= 75) return "#FFA33C";
    if (progress < 100) return "#FC7033";
    return "#6DA951";
  };

  const checkIfTaskExceededTime = (task) => {
    const taskEndTime = new Date(`${formattedDate} ${task?.endDate}`);
    const currentTime = new Date();

    return taskEndTime < currentTime && !task?.isCompleted;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(calculateYearlyTaskProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(fetchYearlyTasks());
  }, [dispatch]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md md:max-w-4xl lg:mx-auto flex flex-col lg:flex-row lg:space-x-4 mb-6">
        <div className="w-full rounded-lg shadow-lg p-5 mb-4 lg:mb-0 bg-[#F0C1E1]">
          <h1 className="text-2xl font-semibold mb-6 text-[#2e2e2e]">
            Yearly Checklist
          </h1>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-3 border rounded-md border-gray-300"
              placeholder="Task Name"
            />
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="w-full lg:w-1/3">
                <label className="block text-black">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  <option value="">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="w-full lg:w-1/3">
                <label className="block text-black">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  min={formatDateForInput(today)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
            <button
              onClick={handleAddTask}
              className={`w-full py-3 ${
                yearlyTask.length >= 1 ? "cursor-not-allowed" : ""
              } rounded-md bg-[#674188] text-white hover:bg-[#563177] transition-colors`}
              disabled={
                yearlyTask.length >= 1 ||
                !taskName.trim() ||
                !priority.trim() ||
                !startDate.trim() ||
                !endDate.trim() ||
                !!errorMessage
              }
            >
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="max-w-md md:max-w-4xl lg:mx-auto mb-6 p-6 rounded-lg bg-[#F0C1E1]">
        <h2 className="text-2xl font-semibold text-left mb-6 text-[#2e2e2e]">
          Yearly Tasks
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#674188] text-white">
                <th className="px-4 py-3">Task Name</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Progress</th>
                {/* <th className="px-4 py-3">Completed</th> */}
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {yearlyTask.map((task) => {
                return (
                  <tr
                    key={task._id}
                    className={task.isCompleted ? "bg-[#E6F9E6]" : "bg-white"}
                  >
                    <td className="px-4 py-2 text-center text-black">
                      {task.taskName}
                    </td>
                    <td className="px-4 py-2 text-center text-black">
                      {task.priority}
                    </td>
                    <td className="px-4 py-2 text-center text-black">
                      {new Date(task.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center text-black">
                      {new Date(task.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative h-5 bg-gray-200 rounded-full">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${task.progress}%`,
                            backgroundColor: getProgressColor(task.progress),
                          }}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={task?.isCompleted}
                        onChange={() => toggleCompletion(task)}
                        className={`h-4 w-4 ${
                          task.isCompleted ? "cursor-not-allowed" : ""
                        }`}
                        disabled={task.isCompleted}
                      />
                    </td> */}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-[#FC7033] hover:bg-[#F37220] text-white px-4 py-2 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default YearlyTask;
