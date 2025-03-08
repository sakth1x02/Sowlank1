import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../store/task-slice.jsx";

const OverdueTask = () => {
  const { dailyTask } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const dailyTaskData = dailyTask.filter((task) => task.hasExceededTime);

  // Group tasks by date
  const groupedTasks = dailyTaskData.reduce((acc, task) => {
    const date = new Date(task.date.split("T")[0]).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedTasks).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  return (
    <div className="md:max-w-4xl md:mx-auto md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Over Due Tasks History
      </h1>

      <div className="space-y-6">
        {sortedDates.length > 0 ? (
          sortedDates.map((date, index) => {
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <div className="space-y-3">
                  {groupedTasks[date].map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.isCompleted}
                          readOnly
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`text-lg ${
                            task.isCompleted
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          }`}
                        >
                          {task.taskName}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(task.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-lg font-semibold italic text-gray-800">
            No Previous Data is Present
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueTask;
