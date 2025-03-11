import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Calendar,
  Trophy,
  Bell,
  Ticket,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const { intermediateMember, advanceMember } = useSelector(
    (state) => state.ui
  );

  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/dailytask",
      label: "Daily Task",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      path: "/weekly",
      label: "Weekly Task",
      icon: <CalendarCheck className="h-5 w-5" />,
      className: advanceMember
        ? ""
        : "hidden" && intermediateMember
        ? ""
        : "hidden",
    },
    {
      path: "/monthly",
      label: "Monthly Task",
      icon: <Calendar className="h-5 w-5" />,
      className: advanceMember
        ? ""
        : "hidden" && intermediateMember
        ? ""
        : "hidden",
    },
    {
      path: "/yearly",
      label: "Yearly Task",
      icon: <Calendar className="h-5 w-5" />,
      className: advanceMember === true ? "" : "hidden",
    },
    {
      path: "/completed-task",
      label: "Completed Task",
      icon: <CalendarCheck className="h-5 w-5" />,
    },
    {
      path: "/overdue-task",
      label: "Overdue Task",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      path: "/rankings",
      label: "Power Ranking",
      icon: <Trophy className="h-5 w-5" />,
      className: advanceMember
        ? ""
        : "hidden" && intermediateMember
        ? ""
        : "hidden",
    },
    {
      path: "/reminders",
      label: "Reminders",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      path: "/coupons",
      label: "Coupons",
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" mt-[5px] z-50 p-2 bg-gray-800 rounded-lg lg:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5 text-white" />
        ) : (
          <ChevronRight className="h-5 w-5 text-white" />
        )}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isExpanded ? "w-64" : "w-20"} lg:translate-x-0 z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-center">
            <h1
              className={`text-xl font-bold text-white ${
                !isExpanded && "hidden"
              }`}
            >
              Task Manager
            </h1>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="py-4">
              {menuItems.map((item) => (
                <li key={item.path} className={`px-4 py-2 ${item.className}`}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-gray-700 text-white font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className={`ml-3 ${!isExpanded && "hidden"}`}>
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-gray-700 text-white rounded-lg m-4 lg:hidden"
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
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
