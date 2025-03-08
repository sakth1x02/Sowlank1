import React, { useState } from "react";
import WeeklyTask from "./WeeklyTask";
import TaskChart from "./TaskChart";
import DailyTask from "./dailyTask";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
        Task Manager
      </h1>

      <div className="flex space-x-4 mb-6">
        <div className="w-1/2">
          <DailyTask tasks={tasks} setTasks={setTasks} />
      </div>
        <div className="w-1/2">
          <WeeklyTask tasks={tasks} setTasks={setTasks} />
        </div>
      </div>

      <TaskChart tasks={tasks} />
    </div>
  );
};

export default TaskManager;
