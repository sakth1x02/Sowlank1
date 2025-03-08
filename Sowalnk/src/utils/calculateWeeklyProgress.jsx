export const calculateWeeklyProgress = (task) => {
  const start = new Date(task.startDate);
  const end = new Date(task.endDate);
  const now = new Date();

  if (now <= start) return 0;
  if (now >= end) return 100;

  return Math.round(((now - start) / (end - start)) * 100);
};
