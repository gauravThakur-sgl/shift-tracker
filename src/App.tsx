import { useState } from "react";
import { Button } from "./components/ui/button";

export const App = () => {
 const [checkInTime, setCheckInTime] = useState<Date | null>(null);
 const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
 const [status, setStatus] = useState("");

 const handleCheckIn = () => {
  alert("Successfully Checked In");
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
   if (totalTime / (1000 * 60 * 60) >= 9) {
    alert("Successfully Checked Out");
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
    <div className="shadow-md rounded-md mx-2 border flex flex-col justify-center w-full gap-4 p-4 min-h-96 pb-40 max-w-screen-mobile">
      <h3 className="text-2xl font-bold text-blue-800 text-center">Shift Tracker</h3>
     {checkInTime && (
      <p className="text-center text-blue-800 text-normal font-semibold">
       CheckIn Time: {checkInTime.toLocaleTimeString()}
      </p>
     )}

     {status && (
      <p className="text-center text-red-500 text-normal font-medium">{status}</p>
     )}

     {checkInTime ? (
      <Button onClick={handleCheckOut} className="bg-green-500 hover:bg-green-600 font-semibold text-sm text-white">
       Check Out
      </Button>
     ) : (
      <Button onClick={handleCheckIn} className="text-sm font-semibol">Check In</Button>
     )}
     <Button variant="destructive" onClick={handleReset}>
      Reset
     </Button>
    </div>
   </div>
  </>
 );
};
