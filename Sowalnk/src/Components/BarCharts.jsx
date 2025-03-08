import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";
const BarCharts = () => {
  const { dailyTask } = useSelector((state) => state.task);
  const { weeklyTask } = useSelector((store) => store.weekly);

  // const WeeklyValue = weeklyTask.map((task) => task.isCompleted).length;
  const WeeklyValue = 5;
  const MonthlyValue = 2;
  const YearlyValue = 80;
  const DailyValue = dailyTask.filter(
    (task) => task.isCompleted === true
  ).length;

  const getArcLabel = (params) => {
    if (params.label === "Daily Task") {
      if (params.value === 0 || params.value === null) {
        return "0 %";
      }
      const percent = params.value / dailyTask.length;
      return `${(percent * 100).toFixed(1)}%`;
    }
    // else if (params.label === "Weekly Task") {
    //   if (params.value === 0) {
    //     return "0 %";
    //   }
    //   const percent = params.value / weeklyTask.length;
    //   return `${percent.toFixed(1)}%`;
    // }
  };

  return (
    <PieChart
      series={[
        {
          data: [
            {
              id: 0,
              value: DailyValue,
              label: "Daily Task",
            },
            { id: 1, value: WeeklyValue, label: "Weekly Task" },
            { id: 2, value: MonthlyValue, label: "Monthly Task" },
          ],
          arcLabel: getArcLabel,
          innerRadius: 50,
        },
      ]}
      width={400}
      height={200}
    />
  );
};
export default BarCharts;

// import * as React from "react";
// import { BarChart } from "@mui/x-charts/BarChart";
// import { axisClasses } from "@mui/x-charts/ChartsAxis";
// import { useSelector } from "react-redux";
// const BarCharts = () => {
//   const { dailyTask } = useSelector((state) => state.task);
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.getMonth() + 1;
//   const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

//   const dataset = Array.from({ length: daysInMonth }, (_, i) => {
//     const day = i + 1;
//     const dailyTasks = dailyTask.filter((task) => {
//       const taskDate = new Date(task.date);
//       return (
//         taskDate.getUTCFullYear() === currentYear &&
//         taskDate.getUTCMonth() + 1 === currentMonth &&
//         taskDate.getUTCDate() === day
//       );
//     });

//     // Calculate average progress for the day
//     const totalProgress = dailyTasks.reduce(
//       (acc, task) => acc + task.progress,
//       0
//     );
//     const averageProgress =
//       dailyTasks.length > 0 ? totalProgress / dailyTasks.length : 0;

//     return {
//       date: day.toString(),
//       progress: averageProgress,
//     };
//   });

//   const chartSetting = {
//     yAxis: [
//       {
//         label: "Progress (%)",
//       },
//     ],
//     width: 500,
//     height: 300,
//     sx: {
//       [`.${axisClasses.left} .${axisClasses.label}`]: {
//         transform: "translate(-20px, 0)",
//       },
//     },
//   };

//   const valueFormatter = (value) => `${Math.round(value)}%`;

//   return (
//     <BarChart
//       dataset={dataset}
//       xAxis={[
//         {
//           scaleType: "band",
//           dataKey: "date",
//           label: currentDate.toLocaleString("default", { month: "long" }),
//         },
//       ]}
//       series={[{ dataKey: "progress", valueFormatter }]}
//       {...chartSetting}
//     />
//   );
// };

// export default BarCharts;
