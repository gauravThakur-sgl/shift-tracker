import { ButtonShift } from "@/components/ButtonShift";
import { InfoCard } from "@/components/InfoCard";
import { Popup } from "@/components/Popup";
import { Button } from "@/components/ui/button";
import { convertTime } from "@/utils/convertTime";
import { useEffect, useState } from "react";

export const ShiftTracker = () => {
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [status, setStatus] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [isShiftOver, setIsShiftOver] = useState(false);
  const [popupState, setPopupState] = useState({
    showPopup: false,
    checkoutPopup: false,
    shiftPopup: false,
  });

  useEffect(() => {
    const savedCheckInTime = localStorage.getItem("checkInTime");
    const savedCheckOutTime = localStorage.getItem("checkOutTime");
    const savedIsShiftOver = localStorage.getItem("isShiftOver");
    if (savedCheckInTime) {
      setCheckInTime(new Date(savedCheckInTime));
    }
    if (savedCheckOutTime) {
      setCheckOutTime(new Date(savedCheckOutTime));
    }
    if (savedIsShiftOver) {
      setIsShiftOver(Boolean(savedIsShiftOver));
    }
  }, []);

  const handleCheckIn = () => {
    setPopupState({ ...popupState, showPopup: true });
    const currentTime = new Date();
    setCheckInTime(currentTime);
    localStorage.setItem("checkInTime", currentTime.toISOString());
  };

  const handleCheckOut = () => {
    if (isShiftOver) {
      setPopupState({ ...popupState, shiftPopup: true });
      return;
    }
    if (checkInTime) {
      const checkOut = new Date();
      setCheckOutTime(checkOut);

      const timeDifference = checkOut.getTime() - checkInTime.getTime();
      setTotalTime(timeDifference.toString());

      localStorage.setItem("checkOutTime", checkOut.toISOString());

      if (Number(totalTime) / (1000 * 60 * 60) >= 9) {
        setIsShiftOver(true);
        localStorage.setItem("isShiftOver", String(isShiftOver));
        setPopupState({ ...popupState, checkoutPopup: true });
        setStatus("");
      } else {
        setStatus(`Total elapsedTime : ${convertTime(timeDifference)}`);
      }
    }
  };

  const handleReset = () => {
    setCheckInTime(null);
    setCheckOutTime(null);
    setStatus("");
    setIsShiftOver(false);
    localStorage.setItem("isShiftOver", String(isShiftOver));
    setTotalTime("");
    localStorage.clear();
  };

  const handleShiftPopup = () => {
    setPopupState({ ...popupState, shiftPopup: false });
    handleReset();
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="shadow-md rounded-md m-2 border flex flex-col justify-start w-full gap-2 p-4 min-h-shift-tracker pb-10 max-w-screen-mobile">
        <h3 className="text-2xl font-bold text-blue-800 text-center">Shift Tracker</h3>

        <p className="text-center font-semibold my-2">Today's Date: {new Date().toLocaleDateString()}</p>

        {checkInTime && (
          <InfoCard className="text-blue-800 bg-blue-50 border-blue-800">
            CheckIn Time: {checkInTime.toLocaleTimeString()}
          </InfoCard>
        )}

        {isShiftOver && (
          <InfoCard className="text-green-800 border-green-800 bg-green-50">
            Last CheckOut Time: {checkOutTime?.toLocaleTimeString()}
          </InfoCard>
        )}

        {status && (
          <InfoCard className="text-red-500 border-red-500 bg-red-50 font-medium flex flex-col justify-center">
            <span>Checkout Failed</span>
            <span className="text-sm font-semibold  pt-2">{status}</span>
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
                <p className="mt-2">You have successfully checked out at {checkOutTime.toLocaleTimeString()}</p>
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
            {checkInTime && <p className="mt-2">You checked in at {checkInTime.toLocaleTimeString()}</p>}
            <Button
              onClick={() => setPopupState({ ...popupState, showPopup: false })}
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
