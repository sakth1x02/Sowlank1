import React from "react";
import { useSelector } from "react-redux";
const YearlyTaskDashboard = ({ openYearlyTask, setOpenYearlyTask }) => {
  const { yearlyTask } = useSelector((store) => store.yearly);
  const { monthlyTask } = useSelector((store) => store.monthly);

  const data = yearlyTask.map((task) => {
    return {
      year: new Date(task.dateOnCreated).getFullYear(),
      taskName: task.taskName,
      isCompleted: task.isCompleted,
    };
  });

  const monthlyTaskCompletedData = monthlyTask.filter(
    (task) => task.isCompleted
  );
  const monthlyUniqueData = new Set(
    monthlyTaskCompletedData.map((task) =>
      new Date(task.dateOnCreated).getMonth()
    )
  );
  console.log(monthlyUniqueData.size);

  const completedValue =
    monthlyUniqueData.size >= 12 || data.some((item) => item.isCompleted);
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setOpenYearlyTask(!openYearlyTask)}
    >
      <div className="bg-rose-300 w-[90%] max-w-xl p-6 rounded-lg shadow-lg flex space-x-4">
        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Yearly Goals</h2>
          <div className="space-y-2">
            {yearlyTask.map((task, taskIndex) => (
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

        <div className="flex-1 bg-white p-4 rounded-md shadow-sm">
          <h1 className="text-xl font-bold mb-4 text-gray-700">
            Elite Yearly Tracker
          </h1>
          <div className="flex items-center justify-between mx-1">
            <div>{data.map((item) => item.year)}</div>
            {yearlyTask.length > 0 && (
              <input
                type="checkbox"
                checked={completedValue || false}
                onChange={() => {}}
                className="mr-2 cursor-pointer "
                style={{
                  transform: "scale(1.5)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyTaskDashboard;
