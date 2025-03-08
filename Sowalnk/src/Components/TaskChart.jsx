import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const TaskChart = ({ tasks = [] }) => {
  const [timePeriod, setTimePeriod] = useState("daily");

  // Updated color scheme with modern, attractive colors
  const taskColors = {
    completed: "#4F46E5", // Deep indigo
    overdue: "#F97316",   // Vibrant orange instead of pink
    pending: "#06B6D4"    // Cyan
  };

  // Generate chart data for the selected time period
  const getTaskStatusData = useMemo(() => {
    const labels =
      timePeriod === "daily"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : timePeriod === "weekly"
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
        : [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

    return labels.map((label, index) => {
      const currentDate = new Date();
      if (timePeriod === "weekly") {
        currentDate.setDate(currentDate.getDate() - (6 - index));
      } else if (timePeriod === "monthly") {
        currentDate.setDate(1 + index * 7);
      }
      const taskDate = currentDate.toDateString();
      
      return {
        name: label,
        completed: tasks.filter(
          (task) =>
            new Date(task.date).toDateString() === taskDate && task.isCompleted
        ).length,
        overdue: tasks.filter(
          (task) =>
            new Date(task.date).toDateString() === taskDate &&
            !task.isCompleted &&
            task.progress === 100
        ).length,
        pending: tasks.filter(
          (task) =>
            new Date(task.date).toDateString() === taskDate &&
            task.progress > 0 &&
            task.progress < 100 &&
            !task.isCompleted
        ).length
      };
    });
  }, [tasks, timePeriod]);

  // Handle empty tasks scenario
  if (!tasks || tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>No tasks available to display.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700 text-center">
        Task Dashboard
      </h1>

      {/* Time Period Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        {["daily", "weekly", "monthly"].map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={`px-4 py-2 rounded ${
              timePeriod === period
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded shadow-md mb-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
          Task Status - {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
        </h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getTaskStatusData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill={taskColors.completed} name="Completed" />
              <Bar dataKey="overdue" fill={taskColors.overdue} name="Overdue" />
              <Bar dataKey="pending" fill={taskColors.pending} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TaskChart;