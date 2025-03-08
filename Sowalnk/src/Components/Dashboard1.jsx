import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../store/task-slice";
import BarCharts from "./BarCharts.jsx";
import Ranking from "./Ranking";
import DailyTaskDashboard from "./daily/DailyTaskDashboard.jsx";
import WeeklyTaskDashboard from "./weekly/WeeklyTaskDashboard.jsx";
import MonthlyTaskDashboard from "./monthly/MonthlyTaskDashboard.jsx";
import YearlyTaskDashboard from "./yearly/YearlyTaskDashboard.jsx";
const DailyGoals = () => {
  const [openDailyTask, setOpenDailyTask] = useState(false);
  const [openWeeklyTask, setOpenWeeklyTask] = useState(false);
  const [openMonthlyTask, setOpenMonthlyTask] = useState(false);
  const [openYearlyTask, setOpenYearlyTask] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <div className="text-xl font-semibold text-end">
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
        {/* Container for Daily Goals and Calendar (2-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            className="text-center bg-rose-100 p-6 rounded-lg shadow-lg hover:scale-105"
            onClick={() => setOpenDailyTask(!openDailyTask)}
          >
            <h1 className="text-2xl font-semibold text-center">
              Daily Dashboard
            </h1>
          </div>
          {openDailyTask ? (
            <DailyTaskDashboard
              openDailyTask
              setOpenDailyTask={setOpenDailyTask}
            />
          ) : (
            ""
          )}

          {/* Container for Weekly Goals and Calendar (2-column layout) */}
          <div
            className="text-center bg-rose-100 p-6 rounded-lg shadow-lg hover:scale-105"
            onClick={() => setOpenWeeklyTask(!openWeeklyTask)}
          >
            <h1 className="text-2xl font-semibold text-center">
              Weekly Dashboard
            </h1>
          </div>
          {openWeeklyTask && (
            <WeeklyTaskDashboard
              openWeeklyTask
              setOpenWeeklyTask={setOpenWeeklyTask}
            />
          )}

          {/* Container for Monthly Goals */}
          <div
            className="text-center bg-rose-100 p-6 rounded-lg shadow-lg hover:scale-105"
            onClick={() => setOpenMonthlyTask(!openMonthlyTask)}
          >
            <h1 className="text-2xl font-semibold text-center">
              Monthly Dashboard
            </h1>
          </div>
          {openMonthlyTask && (
            <MonthlyTaskDashboard
              openMonthlyTask
              setOpenMonthlyTask={setOpenMonthlyTask}
            />
          )}

          <div
            className="text-center bg-rose-100 p-6 rounded-lg shadow-lg hover:scale-105"
            onClick={() => setOpenYearlyTask(!openYearlyTask)}
          >
            <h1 className="text-2xl font-semibold text-center">
              Yearly Dashboard
            </h1>
          </div>
          {openYearlyTask && (
            <YearlyTaskDashboard
              openYearlyTask
              setOpenYearlyTask={setOpenYearlyTask}
            />
          )}
        </div>

        {/* barcharts */}
        <div className="flex flex-col pb-10 md:w-[49%] justify-center items-center space-y-6 shadow-lg rounded-md bg-rose-100">
          <div className="text-center text-3xl font-bold mt-10">
            Over All Activity
          </div>
          <BarCharts />
        </div>
      </div>

      {/* Ranking Page */}
      <Ranking />

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-100 p-6 rounded-lg shadow-lg">
        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Weekly Goals</h2>
          <div className="space-y-2">
            {tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="flex items-center">
                <span className="text-lg text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>
        //Weekly Calendar
        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Weekly Calendar
          </h2>
          <div className="grid grid-cols-7 gap-5 text-center">
            {days.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="text-sm font-bold text-gray-700">{day}</h3>
                <div className="flex flex-col items-center space-y-2 mt-2">
                  {tasks.map((_, taskIndex) => (
                    <input
                      key={taskIndex}
                      type="checkbox"
                      checked={dayStatus[taskIndex][dayIndex]}
                      onChange={() => handleDayClick(taskIndex, dayIndex)}
                      className={`h-6 w-6 ${
                        dayStatus[taskIndex][dayIndex]
                          ? "bg-green-200"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DailyGoals;

// const days = ["M", "T", "W", "T", "F", "S", "S"];
// const dailyToday = new Date().getDay();

// const isAnyTaskCompleted = (dayIndex) => {
//   const todayTasks = dailyTask.filter((task) => {
//     const taskDate = new Date(task.date);
//     return taskDate.getDay() === dayIndex;
//   });
//   return todayTasks.some((task) => task.isCompleted);
// };
