import { ButtonShift } from "@/components/ButtonShift";
import { InfoCard } from "@/components/InfoCard";
import { Popup } from "@/components/Popup";
import { Button } from "@/components/ui/button";
import { convertTime } from "@/utils/convertTime";
import { useEffect, useState } from "react";

export const ShiftTracker = () => {
  const [checkInTime, setCheckInTime] = useState<Date | string>("");
  const [checkOutTime, setCheckOutTime] = useState<Date | string>("");
  const [isShiftOver, setIsShiftOver] = useState(false);
  const [lastcheckin, setLastCheckIn] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [popupState, setPopupState] = useState({
    showPopup: false,
    checkoutPopup: false,
    shiftPopup: false,
    resetPopup: false,
  });

  const savedData = {
    savedCheckInTime: localStorage.getItem("intime"),
    savedCheckOutTime: localStorage.getItem("outtime"),
    savedIsShiftOver: localStorage.getItem("shiftover"),
    savedLastCheckIn: localStorage.getItem("lastcheckin"),
  };
  useEffect(() => {
    if (savedData.savedCheckInTime) {
      setCheckInTime(new Date(savedData.savedCheckInTime));
    }
    if (savedData.savedCheckOutTime) {
      setCheckOutTime(new Date(savedData.savedCheckOutTime));
    }
    if (savedData.savedIsShiftOver) {
      setIsShiftOver(Boolean(savedData.savedIsShiftOver));
    }
    if (savedData.savedLastCheckIn) {
      setLastCheckIn(new Date(savedData.savedLastCheckIn).toLocaleTimeString());
    }
  }, [savedData.savedCheckInTime, savedData.savedCheckOutTime, savedData.savedIsShiftOver, savedData.savedLastCheckIn]);

  useEffect(() => {
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
  }, [checkInTime, isShiftOver]);

  const handleCheckIn = () => {
    setIsShiftOver(false);
    setPopupState((prev) => ({ ...prev, showPopup: true }));
    const currentTime = new Date();
    setCheckInTime(currentTime);
    localStorage.setItem("intime", currentTime.toISOString());
    localStorage.setItem("lastcheckin", currentTime.toISOString());
  };

  const totalTime =
    checkInTime && checkOutTime ? (new Date(checkOutTime).getTime() - new Date(checkInTime).getTime()).toString() : "";

  const handleCheckOut = () => {
    if (isShiftOver) {
      setPopupState((prev) => ({ ...prev, shiftPopup: true }));
      return;
    }
    if (checkInTime) {
      const checkOut = new Date(); // in ms
      setCheckOutTime(checkOut);
      localStorage.setItem("outtime", checkOut.toISOString());

      const netShiftTime = Number(totalTime) / (1000 * 60 * 60); // net Shift time in hour

      if (netShiftTime >= 9) {
        setIsShiftOver(true);
        localStorage.setItem("shiftover", String(isShiftOver));
        setPopupState((prev) => ({ ...prev, checkoutPopup: true }));
      }
    }
  };

  const confirmReset = () => {
    setPopupState((prev) => ({ ...prev, resetPopup: true }));
  };

  const handleReset = () => {
    setCheckOutTime("");
    localStorage.setItem("shiftover", String(isShiftOver));
    localStorage.removeItem("outtime");
    localStorage.removeItem("shiftover");
    localStorage.removeItem("intime");
    setCheckInTime("");
    setPopupState((prev) => ({ ...prev, resetPopup: false }));
  };

  const handleShift = () => {
    localStorage.removeItem("lastcheckin");
    setLastCheckIn("");
    handleReset();
    setPopupState((prev) => ({ ...prev, checkoutPopup: false }));
  };

  const showLastCheckIn = lastcheckin && !checkInTime && !isShiftOver; // show last checkin time only when checkin time is not present and shift is not over

  return (
    <div className="h-screen flex justify-center pt-20 pb-40 px-2 bg-slate-100">
      <div className="shadow-md rounded-md m-2 border flex flex-col justify-start w-full gap-2 p-4 max-h-shift-tracker  max-w-screen-mobile ">
        <h3 className="text-2xl font-bold text-blue-800 text-center mt-4">Shift Tracker</h3>

        <p className="text-center font-semibold my-2">Today's Date: {new Date().toLocaleDateString()}</p>

        {showLastCheckIn && (
          <InfoCard className="text-purple-800 bg-purple-50 border-purple-800">
            Last CheckIn Time: {lastcheckin}
          </InfoCard>
        )}

        {checkInTime && (
          <div className="flex justify-between items-center pb-4">
            <p className="font-semibold text-blue-800">Time Remaining</p>
            {timeLeft && (
              <span className="rounded-full px-4 p-1 border border-green-800 text-green-800 bg-green-50 text-sm font-semibold shadow-md">
                {timeLeft.replace("hour", "h :").replace("minutes", "m :").replace("seconds", "s")}
              </span>
            )}
          </div>
        )}

        {checkInTime && !isShiftOver && (
          <InfoCard className="text-blue-800 bg-blue-50 border-blue-800">
            CheckIn Time: {new Date(checkInTime).toLocaleTimeString()}
          </InfoCard>
        )}

        {checkOutTime && !isShiftOver && (
          <InfoCard className="text-red-500 border-red-500 bg-red-50 font-medium flex flex-col justify-center">
            <span>Checkout Failed</span>
            <span className="text-sm font-semibold  pt-2">{`Total elapsedTime : ${convertTime(
              Number(totalTime),
            )}`}</span>
          </InfoCard>
        )}

        <div className={`${checkInTime ? "mt-16" : "mt-20"} w-full flex flex-col gap-2`}>
          {checkInTime ? (
            <ButtonShift onClick={handleCheckOut} label="Check Out" className="bg-green-500 hover:bg-green-600 " />
          ) : (
            <ButtonShift onClick={handleCheckIn} label="Check In" className="bg-blue-800 hover:bg-blue-700 " />
          )}
          <ButtonShift onClick={confirmReset} label="Reset" className="bg-red-500 hover:bg-red-600" />
        </div>

        {popupState.resetPopup && (
          <Popup popUpInfo="Are you sure you want to reset?" className="space-x-2">
            <Button onClick={handleReset} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Confirm
            </Button>
            <Button
              onClick={() => setPopupState((prev) => ({ ...prev, resetPopup: false }))}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </Button>
          </Popup>
        )}

        {popupState.checkoutPopup && (
          <Popup popUpInfo="Check Out Successful">
            {checkOutTime && (
              <>
                <p className="mt-2">
                  You have successfully checked out at {new Date(checkOutTime).toLocaleTimeString()}
                </p>
                <p>Total Work Hour: {convertTime(Number(totalTime))}</p>
              </>
            )}
            <Button
              onClick={handleShift}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </Button>
          </Popup>
        )}

        {popupState.showPopup && (
          <Popup popUpInfo="Check In Successful">
            {checkInTime && <p className="mt-2">You checked in at {new Date(checkInTime).toLocaleTimeString()}</p>}
            <Button
              onClick={() => setPopupState((prev) => ({ ...prev, showPopup: false }))}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </Button>
          </Popup>
        )}
      </div>
    </div>
  );
};
