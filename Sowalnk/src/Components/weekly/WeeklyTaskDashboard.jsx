import React from "react";
import { useSelector } from "react-redux";
import WeeksInMonth from "../WeeksInMonth.jsx";
const WeeklyTaskDashboard = ({ openWeeklyTask, setOpenWeeklyTask }) => {
  const { dailyTask } = useSelector((state) => state.task);
  const { weeklyTask } = useSelector((store) => store.weekly);

  const today = new Date();
  const getWeekInMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    return Math.ceil((dayOfMonth + firstDayOfMonth.getDay()) / 7);
  };

  const completedWeekTaskNum = weeklyTask
    .filter((task) => task.isCompleted)
    .map((task) => {
      const weekNum = getWeekInMonth(new Date(task.dateOnCreated));
      return { ...task, weekNum };
    });
  // Group completed tasks by week number in month
  const completedTasksByWeek = {};
  dailyTask.forEach((task) => {
    if (task.isCompleted) {
      const taskDate = new Date(task.date);
      // Only process tasks from current month
      if (taskDate.getMonth() === today.getMonth()) {
        const weekNum = getWeekInMonth(taskDate);

        if (!completedTasksByWeek[weekNum]) {
          completedTasksByWeek[weekNum] = new Set();
        }
        completedTasksByWeek[weekNum].add(taskDate.getDay());
      }
    }
  });

  // Check which weeks have all 7 days completed
  const completedWeeks = Object.keys(completedTasksByWeek).filter(
    (weekNum) => completedTasksByWeek[weekNum].size >= 7
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setOpenWeeklyTask(!openWeeklyTask)}
    >
      <div className="bg-rose-300 w-[90%] max-w-xl p-6 rounded-lg shadow-lg ">
        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Weekly Goals</h2>
          <div className="space-y-2">
            {weeklyTask.map((task, taskIndex) => (
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

        <WeeksInMonth
          year={today.getFullYear()}
          month={today.getMonth()}
          weekIndx={getWeekInMonth(today)}
          completedWeeks={completedWeeks.map(Number)}
          completedWeekTaskNum={completedWeekTaskNum.map(
            (task) => task.weekNum
          )}
        />
      </div>
    </div>
  );
};

export default WeeklyTaskDashboard;
