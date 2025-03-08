import React from "react";
import { useSelector } from "react-redux";
const WeeksInMonth = ({
  year,
  month,
  weekIndx,
  completedWeeks,
  completedWeekTaskNum,
}) => {
  const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month, 1); // Start at the first day of the month
    while (date.getMonth() === month) {
      days.push(new Date(date)); // Push a copy of the date
      date.setDate(date.getDate() + 1); // Move to the next day
    }
    return days;
  };

  // Get all days in the selected month
  const daysInMonth = getDaysInMonth(year, month);

  // Group days into weeks
  const weeks = [];
  let currentWeek = [];
  daysInMonth.forEach((day) => {
    currentWeek.push(day);
    if (
      day.getDay() === 6 ||
      day.getTime() === daysInMonth[daysInMonth.length - 1].getTime()
    ) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">
        Weekly Calendar in{" "}
        {new Date(year, month).toLocaleDateString("en-US", { month: "long" })}/
        {year}
      </h2>
      <div className="flex gap-1">
        {weeks.map((week, index) => {
          return (
            <div key={index} className="p-4 text-center rounded-lg bg-gray-50">
              <pre
                className={`font-medium ${
                  index + 1 === weekIndx ? "text-blue-600" : ""
                }`}
              >
                Week{index + 1}
              </pre>
              <input
                id={`weeklytask-${index}`}
                name="weeklytask"
                type="checkbox"
                checked={
                  completedWeeks.includes(index + 1) ||
                  completedWeekTaskNum.includes(index + 1)
                }
                onChange={() => {}}
                className=""
                style={{
                  transform: "scale(1.5)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeksInMonth;
