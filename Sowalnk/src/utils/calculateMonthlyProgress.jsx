export const calculateMonthlyProgress = (start, end) => {
  const currentDate = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999);

  if (currentDate < startDate) return 0;
  if (currentDate >= endDate) return 100;

  const totalDuration = endDate - startDate;
  const timePassed = currentDate - startDate;
  return Math.round((timePassed / totalDuration) * 100);
};
