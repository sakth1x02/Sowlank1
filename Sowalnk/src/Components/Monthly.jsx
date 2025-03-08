import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MonthlyChecklist = () => {
  const [progress, setProgress] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(null);

  const categories = [
    {
      title: "Complete Project",
    },
    {
      title: "Monthly Review",
    },
    {
      title: "Financial Summary",
    },
    {
      title: "Team Building",
    },
    {
      title: "Resources",
    },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const currentMonthIndex = new Date().getMonth();

  const calculateProgress = (month) => {
    const monthProgress = progress[month] || {};
    let completedTasks = 0;
    let totalTasks = categories.length; // Total number of categories

    categories.forEach((category) => {
      if (monthProgress[category.title]) {
        completedTasks += 1; // Count as completed if any progress is tracked
      }
    });

    return {
      completed: completedTasks,
      total: totalTasks,
    };
  };

  const handleCategoryCompletion = (month, categoryTitle) => {
    setProgress((prev) => {
      const updatedProgress = { ...prev };
      if (!updatedProgress[month]) updatedProgress[month] = {};

      if (updatedProgress[month][categoryTitle]) {
        delete updatedProgress[month][categoryTitle]; // Mark as incomplete
      } else {
        updatedProgress[month][categoryTitle] = true; // Mark as completed
      }

      return updatedProgress;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Monthly Checklist
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.title} className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">{category.title}</h2>
            <div className="grid grid-cols-6 gap-2">
              {months.map((month, index) => {
                const isPastOrCurrent = index <= currentMonthIndex;
                const { completed, total } = calculateProgress(month);

                return (
                  <button
                    key={month}
                    disabled={!isPastOrCurrent}
                    onClick={() => setSelectedMonth({ category: category.title, month })}
                    className={`p-2 rounded-full text-sm flex items-center justify-center border 
                      ${isPastOrCurrent ? (completed > 0 ? "bg-green-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600") : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                  >
                    {month}
                    {completed > 0 && (
                      <span className="ml-1 text-xs">({completed}/{total})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedMonth && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedMonth.category} - {selectedMonth.month}
              </h3>
              <button
                onClick={() => setSelectedMonth(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={
                    progress[selectedMonth.month]?.[selectedMonth.category] || false
                  }
                  onChange={() =>
                    handleCategoryCompletion(
                      selectedMonth.month,
                      selectedMonth.category
                    )
                  }
                  className="h-4 w-4"
                />
                <span>{selectedMonth.category}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MonthlyChecklist;
