import { useState } from "react";
import { Button } from "./components/ui/button";

export const App = () => {
 const [count, setCount] = useState(0);
 return (
  <div className="h-screen flex justify-center items-center">
   <div className="">
    <Button onClick={() => setCount(count + 1)}>{count}</Button>
   </div>
  </div>
 );
};
