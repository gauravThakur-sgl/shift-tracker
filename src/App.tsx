import { useState } from "react";
import { Button } from "./components/ui/button";

export const App = () => {
 const [checkInTime, setCheckInTime] = useState<Date | null>(null);
 const [showPopup, setShowPopup] = useState(false);
 const [checkoutPopup, setCheckoutPopup] = useState(false);
 const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
 const [status, setStatus] = useState("");
 const [totalTime, setTotalTime] = useState("");

 const handleCheckIn = () => {
  // alert("Successfully Checked In");
  setShowPopup(true);
  setCheckInTime(new Date());
 };

 const handleCheckOut = () => {
  if (checkInTime) {
   const checkOut = new Date();
   setCheckOutTime(checkOut);
   const totalTime = checkOut.getTime() - checkInTime.getTime();
   const second = Math.floor((totalTime / 1000) % 60);
   const minute = Math.floor((totalTime / (1000 * 60)) % 60);
   const hour = Math.floor(totalTime / (1000 * 60 * 60));
   console.log(totalTime, "totalTIme");
   setTotalTime(`${hour} hour ${minute} minutes ${second} seconds`);
   if (totalTime / 1000 >= 9) {
    setCheckoutPopup(true);
   } else {
    // alert(`You need to work for ${9 - totalTime} more hours`);
    setStatus(
     `Checkout Failed, total elapsedTime ${hour} hour ${minute} minutes ${second} seconds`
    );
   }
  }
 };

 const handleReset = () => {
  setCheckInTime(null);
  setCheckOutTime(null);
  setStatus("");
 };

 return (
  <>
   <div className="h-screen flex justify-center items-center">
    <div className="shadow-md rounded-md m-2 border flex flex-col justify-start w-full gap-2 p-4 min-h-shift-tracker pb-10 max-w-screen-mobile">
     <h3 className="text-2xl font-bold text-blue-800 text-center">
      Shift Tracker
     </h3>
     <p className="text-center font-semibold my-4">
      Today's Date: {new Date().toLocaleDateString()}
     </p>
     {checkInTime && (
      <p className="text-center text-blue-800 text-normal font-semibold rounded-md border border-blue-800 p-2 bg-blue-50 shadow-md border-opacity-50">
       CheckIn Time: {checkInTime.toLocaleTimeString()}
      </p>
     )}

     {status && (
      <p className="text-center text-red-500 text-normal font-medium border border-red-500 bg-red-50 shadow-md border-opacity-50 p-2 rounded-md">
       {status}
      </p>
     )}

     <div
      className={`${
       checkInTime ? "mt-16" : "mt-20"
      } w-full flex flex-col gap-2`}
     >
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
        className="text-sm font-semibol shadow-md text-white bg-blue-900 hover:bg-blue-800 "
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300">
       <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center py-10">
        <p className="text-lg font-semibold">Check Out Successful</p>
        {checkOutTime && (
         <>
          <p className="mt-2">
           You checkedOut in at {checkOutTime.toLocaleTimeString()}
          </p>
          <p>Total Work Hour: {totalTime}</p>
         </>
        )}
        <button
         onClick={() => setCheckoutPopup(false)}
         className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
         Close
        </button>
       </div>
      </div>
     )}
     {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300">
       <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center py-10">
        <p className="text-lg font-semibold">Check In Successful</p>
        {checkInTime && (
         <p className="mt-2">
          You checked in at {checkInTime.toLocaleTimeString()}
         </p>
        )}
        <button
         onClick={() => setShowPopup(false)}
         className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
         Close
        </button>
       </div>
      </div>
     )}
    </div>
   </div>
  </>
 );
};
