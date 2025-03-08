import React from 'react'
import { useState,useEffect } from "react";

const TimeDay = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    const formattedDate = currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  
    const formattedTime = currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  
    return (
      <div className="p-4 bg-blue-100 rounded-lg shadow-lg flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700">{formattedDate}</h2>
        <h2 className="text-xl font-bold text-gray-700">{formattedTime}</h2>
      </div>
    );
  };

  export default TimeDay;
  
