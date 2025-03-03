export const startShiftTimer = (
  checkInTime: Date,
  isShiftOver: boolean,
  setTimeLeft: (time: string) => void,
  convertTime: (ms: number) => string,
) => {
  if (checkInTime && !isShiftOver) {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const checkIn = new Date(checkInTime);
      const shiftDuration = 9 * 60 * 60 * 1000; // 9 hours in ms
      const endTime = new Date(checkIn.getTime() + shiftDuration);
      const remainingTime = endTime.getTime() - currentTime.getTime();
      if (remainingTime > 0) {
        setTimeLeft(convertTime(remainingTime));
      } else {
        setTimeLeft("Shift Over");
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }
};
