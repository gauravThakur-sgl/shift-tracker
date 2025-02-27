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
  const [popupState, setPopupState] = useState({
    showPopup: false,
    checkoutPopup: false,
    shiftPopup: false,
  });
  const savedData = {
    savedCheckInTime: localStorage.getItem("intime"),
    savedCheckOutTime: localStorage.getItem("outtime"),
    savedIsShiftOver: localStorage.getItem("shiftover"),
  }
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
  }, []);

  const handleCheckIn = () => {
    setPopupState((prev) => ({ ...prev, showPopup: true }));
    const currentTime = new Date();
    setCheckInTime(currentTime);
    localStorage.setItem("intime", currentTime.toISOString());
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

  const handleReset = () => {
    setCheckInTime("");
    setCheckOutTime("");
    setIsShiftOver(false);
    localStorage.setItem("shiftover", String(isShiftOver));
    localStorage.clear();
  };

  const handleShiftPopup = () => {
    setPopupState((prev) => ({ ...prev, shiftPopup: false }));
    handleReset();
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="shadow-md rounded-md m-2 border flex flex-col justify-start w-full gap-2 p-4 min-h-shift-tracker pb-10 max-w-screen-mobile">
        <h3 className="text-2xl font-bold text-blue-800 text-center">Shift Tracker</h3>

        <p className="text-center font-semibold my-2">Today's Date: {new Date().toLocaleDateString()}</p>

        {checkInTime && (
          <InfoCard className="text-blue-800 bg-blue-50 border-blue-800">
            CheckIn Time: {new Date(checkInTime).toLocaleTimeString()}
          </InfoCard>
        )}

        {isShiftOver && (
          <InfoCard className="text-green-800 border-green-800 bg-green-50">
            Last CheckOut Time: {new Date(checkOutTime).toLocaleTimeString()}
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
          <ButtonShift onClick={handleReset} label="Reset" className="bg-red-500 hover:bg-red-600" />
        </div>

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
              onClick={() => setPopupState({ ...popupState, checkoutPopup: false })}
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

        {popupState.shiftPopup && (
          <Popup popUpInfo="Shift is over">
            {checkInTime && <p className="mt-2">Total Shift Time: {convertTime(Number(totalTime))}</p>}
            <Button
              onClick={handleShiftPopup}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Click to reset
            </Button>
          </Popup>
        )}
      </div>
    </div>
  );
};
