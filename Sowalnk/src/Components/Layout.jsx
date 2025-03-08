import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
const Layout = () => {
  const auth = useSelector((state) => state.user.loggedInUser);
  const calculateRemainingTime = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const difference = midnight - now;

    return Math.floor(difference / (1000 * 60));
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime();
      setRemainingTime(newRemainingTime);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const totalTimeInMinutes = 24 * 60;
  const progressPercentage =
    ((totalTimeInMinutes - remainingTime) / totalTimeInMinutes) * 100;

  const getProgressBarColor = () => {
    if (progressPercentage < 50) {
      return "bg-green-600";
    } else if (progressPercentage < 80) {
      return "bg-orange-500";
    } else {
      return "bg-red-600";
    }
  };

  return (
    <>
      <Header />
      <div
        className={`w-full h-10 bg-gray-200 relative ${
          auth ? "block" : "hidden"
        }`}
      >
        <div
          className={`h-full ${getProgressBarColor()}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-black font-bold">
          {remainingTime} minutes remaining
        </div>
      </div>
      <div className="flex flex-row min-h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <main className="flex-1 relative p-4 lg:ml-64">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
