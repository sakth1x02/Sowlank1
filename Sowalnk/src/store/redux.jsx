import { configureStore } from "@reduxjs/toolkit";
import { uiReducerFun } from "./ui-slice";
import taskReducerFun from "./task-slice";
import weekltReducerFun from "./weekly-slice";
import monthlyReducerFun from "./monthly-slice";
import yearlyReducerFun from "./yearly-slice";
import userReducerFun from "./user-slice.jsx";
const store = configureStore({
  reducer: {
    ui: uiReducerFun,
    task: taskReducerFun,
    weekly: weekltReducerFun,
    monthly: monthlyReducerFun,
    yearly: yearlyReducerFun,
    user: userReducerFun,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
