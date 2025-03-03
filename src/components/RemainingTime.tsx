export const RemainingTime = ({ timeLeft }: { timeLeft: string }) => {
  return (
    <div className="flex justify-between items-center pb-4">
      <p className="font-semibold text-blue-800">Time Remaining</p>
      {timeLeft && (
        <span className="rounded-full px-4 p-1 border border-green-800 text-green-800 bg-green-50 text-sm font-semibold shadow-md">
          {timeLeft.replace("hour", "h :").replace("minutes", "m :").replace("seconds", "s")}
        </span>
      )}
    </div>
  );
};
