import React from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { intermediateMember, advanceMember } = useSelector(
    (state) => state.ui
  ); // Get the state from the store
  const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dailytask", label: "Daily Task" },
    {
      path: "/weekly",
      label: "Weekly Task",
      className: advanceMember
        ? ""
        : "hidden" && intermediateMember
        ? ""
        : "hidden",
    },
    {
      path: "/monthly",
      label: "Monthly Task",
      className: advanceMember
        ? ""
        : "hidden" && intermediateMember
        ? ""
        : "hidden",
    },
    {
      path: "/yearly",
      label: "Yearly Task",
      className: advanceMember === true ? "" : "hidden",
    },
    { path: "/completed-task", label: "Completed Task" },
    { path: "/overdue-task", label: "Overdue Task" },
    {
      path: "/rankings",
      label: "Power Ranking",
      className: advanceMember
        ? ""
        : "hidden" && intermediateMember
        ? ""
        : "hidden",
    },
    { path: "/reminders", label: "Reminders" },
    { path: "/coupons", label: "Coupons" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative top-1 left-[-3px] z-50 p-2  lg:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white fixed top-6 left-[9px]" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-center border-b border-gray-700">
            <h1 className="text-xl font-bold text-white">Task Manager</h1>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="py-4">
              {menuItems.map((item) => (
                <li key={item.path} className={`px-4  py-2 ${item.className}`}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center  px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-gray-700 text-white font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
