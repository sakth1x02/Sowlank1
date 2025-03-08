import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const DailyTaskDashboard = ({ openDailyTask, setOpenDailyTask }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [daysWithData, setDaysWithData] = useState([]);
  const { dailyTask } = useSelector((state) => state.task);

  // Generate week data
  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay() + weekOffset * 7);

    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });

    const daysData = dates.map((date) => {
      const tasksForDate = dailyTask.filter((task) => {
        const taskDate = new Date(task.date);
        return taskDate.toDateString() === date.toDateString();
      });

      return {
        date,
        dayAbbrev: date
          .toLocaleDateString("en-US", { weekday: "short" })
          .slice(0, 1),
        dayNumber: date.getDate(),
        tasks: tasksForDate,
        hasCompleted: tasksForDate.some((task) => task.isCompleted),
      };
    });

    setDaysWithData(daysData);
  }, [dailyTask, weekOffset]);

  // Week navigation handlers
  const handlePreviousWeek = (e) => {
    e.stopPropagation();
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = (e) => {
    e.stopPropagation();
    setWeekOffset((prev) => Math.min(prev + 1, 0));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setOpenDailyTask(!openDailyTask)}
    >
      <div className="bg-rose-300 w-[90%] h-[40%] md:h-[70%] overflow-scroll max-w-2xl p-6 rounded-lg shadow-lg flex gap-4">
        {/* Daily Goals Section */}
        <div className="w-[40%] h-full overflow-scroll bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Daily Goals</h2>
          <div className="space-y-[2px]">
            {dailyTask
              .filter(
                (task) =>
                  new Date(task.date).toDateString() ===
                  new Date().toDateString()
              )
              .map((task) => (
                <div
                  key={task._id}
                  className="flex ml-[3px] mt-[46px] items-center justify-between gap-2 rounded"
                >
                  <span
                    className={`text-base ${
                      task.isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {task.taskName}
                  </span>
                  <input
                    type="checkbox"
                    checked={task.isCompleted || false}
                    readOnly
                    className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Calendar Section */}
        <div className="overflow-auto w-[60%] bg-white p-4 rounded-md shadow-sm flex flex-col h-full">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-700">Daily Calendar</h2>
          </div>

          <div className="grid grid-cols-7 gap-2 flex-grow">
            {daysWithData.map(({ date, dayAbbrev, dayNumber, tasks }) => {
              const isToday = date.toDateString() === new Date().toDateString();
              const isPastDate = date < new Date() && !isToday;

              return (
                <div
                  key={date.toISOString()}
                  className={`p-2 rounded-lg text-center ${
                    isPastDate
                      ? "bg-gray-100 opacity-50"
                      : isToday
                      ? "bg-blue-100"
                      : "bg-gray-200 opacity-60"
                  }`}
                >
                  <div className="text-center mb-1">
                    <div
                      className={`text-sm font-semibold ${
                        isToday ? "text-blue-700" : "text-gray-500"
                      }`}
                    >
                      {dayAbbrev}
                    </div>
                  </div>

                  <div className="">
                    {tasks.map((task, index) => (
                      <div key={task._id} className="">
                        {task.isCompleted ? (
                          <input
                            key={index}
                            type="checkbox"
                            checked={task.isCompleted || false}
                            readOnly
                            className={`h-5 w-5 rounded-sm border-gray-300 cursor-default`}
                          />
                        ) : (
                          <input
                            key={index}
                            type="checkbox"
                            checked={false}
                            readOnly
                            className={`h-5 w-5 rounded-sm border-gray-300 cursor-default`}
                          />
                        )}
                      </div>
                    ))}
                    {Array.from({
                      length: Math.max(
                        0,
                        dailyTask.filter(
                          (task) =>
                            new Date(task.date).toDateString() ===
                            new Date().toDateString()
                        ).length - tasks.length
                      ),
                    }).map((_, index) => (
                      <input
                        key={`empty-${index}`}
                        type="checkbox"
                        checked={false}
                        readOnly
                        className={`h-5 w-5 rounded-sm border-gray-300 cursor-default`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* pagination */}
          <div className="flex justify-between mt-auto pt-3">
            <button
              onClick={handlePreviousWeek}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
            >
              ← Previous
            </button>
            <button
              onClick={handleNextWeek}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700"
              disabled={weekOffset === 0}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTaskDashboard;
