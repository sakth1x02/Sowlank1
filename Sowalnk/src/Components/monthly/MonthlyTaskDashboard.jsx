import React from "react";
import { useSelector } from "react-redux";
import CircularProgressDemo from "./Progress";

const MonthlyTaskDashboard = ({ openMonthlyTask, setOpenMonthlyTask }) => {
  const { monthlyTask } = useSelector((store) => store.monthly);

  const { dailyTask } = useSelector((state) => state.task);

  const { weeklyTask } = useSelector((state) => state.weekly);

  const currentMonthIndex = new Date().getMonth();

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  const completedMonths = dailyTask.reduce((months, task) => {
    if (task.isCompleted) {
      const taskDate = new Date(task.date);
      const taskMonth = taskDate.getMonth();
      const taskYear = taskDate.getFullYear();

      // Group completed tasks by month
      const tasksInMonth = dailyTask.filter((t) => {
        const date = new Date(t.date);
        return (
          t.isCompleted &&
          date.getMonth() === taskMonth &&
          date.getFullYear() === taskYear
        );
      });

      // Get unique dates for this month
      const uniqueDatesInMonth = new Set(
        tasksInMonth.map((t) => new Date(t.date).getDate())
      );

      // Check if number of unique completed dates meets or exceeds days in that month
      if (uniqueDatesInMonth.size >= getDaysInMonth(taskYear, taskMonth)) {
        months.add(taskMonth);
      }
    }
    return months;
  }, new Set());

  // Calculate completed months from weekly tasks
  const weeklyCompletedMonths = weeklyTask.reduce((months, task) => {
    if (task.isCompleted) {
      const taskDate = new Date(task.dateOnCreated);
      const taskMonth = taskDate.getMonth();
      const taskYear = taskDate.getFullYear();

      // Get all weekly tasks for this month
      const weeksInMonth = weeklyTask.filter((t) => {
        const date = new Date(t.dateOnCreated);
        return date.getMonth() === taskMonth && date.getFullYear() === taskYear;
      });

      // Get number of completed weeks in this month
      const completedWeeksCount = weeksInMonth.filter(
        (t) => t.isCompleted
      ).length;

      // Assuming a month needs 4 completed weeks to be considered complete
      if (completedWeeksCount >= 4) {
        months.add(taskMonth);
      }
    }
    return months;
  }, new Set());

  //This is for the monthly task
  const monthlyCompletedMonths = monthlyTask.reduce((months, task) => {
    if (task.isCompleted) {
      const taskDate = new Date(task.dateOnCreated);
      const taskMonth = taskDate.getMonth();
      months.add(taskMonth);
    }
    return months;
  }, new Set());

  // Merge both daily and weekly completed months
  const allCompletedMonths = new Set([
    ...completedMonths,
    ...weeklyCompletedMonths,
    ...monthlyCompletedMonths,
  ]);

  // Update the progress variable to use allCompletedMonths
  const progress = allCompletedMonths.size;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setOpenMonthlyTask(!openMonthlyTask)}
    >
      <div className="bg-rose-300 w-[90%] max-w-xl p-6 rounded-lg shadow-lg flex gap-2">
        {/* Monthly Goal */}
        <div className="w-[40%] overflow-auto bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Monthly Goals
          </h2>
          <div className="space-y-2">
            {monthlyTask.map((task, taskIndex) => (
              <div key={task._id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={task?.isCompleted || false}
                  onChange={() => {}}
                  className="mr-2 cursor-pointer "
                  style={{
                    transform: "scale(1.5)",
                  }}
                />
                <span
                  className={`text-lg ${
                    task?.isCompleted
                      ? "line-through text-gray-800"
                      : "text-gray-700"
                  }`}
                >
                  {task.taskName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* clendar */}
        <div className=" bg-white rounded-lg shadow-lg">
          <div className="p-4 flex flex-col items-center gap-6">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800">
              Monthly Tracker
            </h2>

            {/* Progress Circle */}
            <CircularProgressDemo progressValue={progress} />

            {/* Months Grid */}
            <div className="grid grid-cols-6 gap-2 w-full">
              {months.map((month, index) => {
                const isCompleted = allCompletedMonths.has(index);
                const isCurrentMonth = index === currentMonthIndex;

                return (
                  <div
                    key={index}
                    className={`
                    flex items-center justify-center p-2 rounded-full text-sm
                    ${
                      isCurrentMonth
                        ? isCompleted
                          ? "bg-green-200 text-green-800"
                          : "bg-blue-200 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }
                  `}
                  >
                    {month}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MonthlyTaskDashboard;
