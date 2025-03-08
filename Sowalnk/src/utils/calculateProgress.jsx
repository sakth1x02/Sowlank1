export const calculateProgress = (start, end, hasExceededTime) => {
  // If task has exceeded time, return 100
  if (hasExceededTime) return 100;

  const currentTime = new Date();
  const today = new Date();

  // Create proper date objects for start and end times
  const [startHours, startMinutes] = start.split(":");
  const [endHours, endMinutes] = end.split(":");

  const startTime = new Date(today.setHours(startHours, startMinutes, 0, 0));
  const endTime = new Date(today.setHours(endHours, endMinutes, 0, 0));

  if (currentTime < startTime) return 0;
  if (currentTime > endTime) return 100;

  const totalDuration = endTime - startTime;
  const timePassed = currentTime - startTime;

  return Math.min(100, Math.round((timePassed / totalDuration) * 100));
};
