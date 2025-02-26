import { Popup } from "@/components/Popup";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const ShiftTracker = () => {
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [checkoutPopup, setCheckoutPopup] = useState(false);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [status, setStatus] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [isShiftOver, setIsShiftOver] = useState(false);
  const [shiftPopup, setShiftPopup] = useState(false);
  const [shiftOverTime, setShiftOverTime] = useState("");

  useEffect(() => {
    const savedCheckInTime = localStorage.getItem("checkInTime");
    const savedCheckOutTime = localStorage.getItem("checkOutTime");
    if (savedCheckInTime) {
      setCheckInTime(new Date(savedCheckInTime));
    }
    if (savedCheckOutTime) {
      setCheckOutTime(new Date(savedCheckOutTime));
    }
  }, []);

  useEffect(() => {
    if (checkInTime) {
      localStorage.setItem("checkInTime", checkInTime.toISOString());
    } else {
      localStorage.removeItem("checkInTime");
    }
  }, [checkInTime]);
  useEffect(() => {
    if (checkOutTime) {
      localStorage.setItem("checkOutTime", checkOutTime.toISOString());
    } else {
      localStorage.removeItem("checkInTime");
    }
  }, [checkOutTime]);

  const handleCheckIn = () => {
    setShowPopup(true);
    setCheckInTime(new Date());
  };

  const handleCheckOut = () => {
    if (isShiftOver) {
      setShiftPopup(true);
      return;
    }
    if (checkInTime) {
      const checkOut = new Date();
      setCheckOutTime(checkOut);
      const totalTime = checkOut.getTime() - checkInTime.getTime();
      const second = Math.floor((totalTime / 1000) % 60);
      const minute = Math.floor((totalTime / (1000 * 60)) % 60);
      const hour = Math.floor(totalTime / (1000 * 60 * 60));
      console.log(totalTime, "totalTIme");
      setTotalTime(`${hour} hour ${minute} minutes ${second} seconds`);
      if (totalTime / (1000 * 60 * 60) >= 9) {
        setIsShiftOver(true);
        setCheckoutPopup(true);
        setStatus("");
        setShiftOverTime(`${hour} hour ${minute} minutes ${second} seconds`);
      } else {
        setStatus(`Total elapsedTime : ${hour} hour ${minute} minutes ${second} seconds`);
      }
    }
  };

  const handleReset = () => {
    setCheckInTime(null);
    setCheckOutTime(null);
    setStatus("");
    setIsShiftOver(false);
    setShiftOverTime("");
    localStorage.clear();
  };

  const handleShiftPopup = () => {
    setShiftPopup(false);
    setCheckInTime(null);
    setCheckOutTime(null);
    setStatus("");
    setIsShiftOver(false);
    setShiftOverTime("");
    localStorage.clear();
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="shadow-md rounded-md m-2 border flex flex-col justify-start w-full gap-2 p-4 min-h-shift-tracker pb-10 max-w-screen-mobile">
        <h3 className="text-2xl font-bold text-blue-800 text-center">Shift Tracker</h3>

        <p className="text-center font-semibold my-2">Today's Date: {new Date().toLocaleDateString()}</p>

        {checkInTime && (
          <p className="text-center text-blue-800 text-normal font-semibold rounded-md border border-blue-800 p-2 bg-blue-50 shadow-md border-opacity-50">
            CheckIn Time: {checkInTime.toLocaleTimeString()}
          </p>
        )}

        {shiftOverTime && (
          <p className="text-center text-green-800 text-normal font-semibold rounded-md border border-green-800 p-2 bg-green-50 shadow-md border-opacity-50">
            Last CheckOut Time: {shiftOverTime}
          </p>
        )}

        {status && (
          <div className="flex flex-col justify-center">
            <p className="flex flex-col justify-center text-red-500 text-normal font-medium border border-red-500 bg-red-50 shadow-md border-opacity-50 p-2 rounded-md">
              <span className="text-center">Checkout Failed</span>
              <span className="text-sm font-semibold text-center pt-2">{status}</span>
            </p>
          </div>
        )}

        <div className={`${checkInTime ? "mt-16" : "mt-20"} w-full flex flex-col gap-2`}>
          {checkInTime ? (
            <Button
              onClick={handleCheckOut}
              className="bg-green-500 hover:bg-green-600 font-semibold text-sm text-white shadow-md"
            >
              Check Out
            </Button>
          ) : (
            <Button
              onClick={handleCheckIn}
              className="text-sm font-semibold shadow-md text-white bg-blue-800 hover:bg-blue-700 "
            >
              Check In
            </Button>
          )}
          <Button
            onClick={handleReset}
            className="shadow-md text-white bg-red-500 text-sm font-semibold hover:bg-red-600"
          >
            Reset
          </Button>
        </div>

        {checkoutPopup && (
          <Popup popUpInfo="Check Out Successful">
            {checkOutTime && (
              <>
                <p className="mt-2">You have successfully checked out at {checkOutTime.toLocaleTimeString()}</p>
                <p>Total Work Hour: {totalTime}</p>
              </>
            )}
            <Button
              onClick={() => setCheckoutPopup(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </Button>
          </Popup>
        )}

        {showPopup && (
          <Popup popUpInfo="Check In Successful">
            {checkInTime && <p className="mt-2">You checked in at {checkInTime.toLocaleTimeString()}</p>}
            <Button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </Button>
          </Popup>
        )}

        {shiftPopup && (
          <Popup popUpInfo="Shift is over">
            {checkInTime && <p className="mt-2">Total Shift Time: {shiftOverTime}</p>}
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
