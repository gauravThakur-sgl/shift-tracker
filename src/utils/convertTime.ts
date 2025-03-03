export const convertTime = (time: number) => {
  const second = Math.floor((time / 1000) % 60);
  const minute = Math.floor((time / (1000 * 60)) % 60);
  const hour = Math.floor(time / (1000 * 60 * 60));
  return `${hour} hour ${minute} minutes ${second} seconds`;
};
