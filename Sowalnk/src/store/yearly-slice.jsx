import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { calculateMonthlyProgress } from "../utils/calculateMonthlyProgress.jsx";
// Async actions
export const fetchYearlyTasks = createAsyncThunk(
  "yearlytask/fetchYearlyTasks",
  async () => {
    const response = await fetch("/api/v1/yearlytask/yearly", {
      credentials: "include",
    });
    return await response.json();
  }
);

export const addYearlyTask = createAsyncThunk(
  "yearlytask/addYearlyTask",
  async (task) => {
    const response = await fetch("/api/v1/yearlytask/yearly", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return await response.json();
  }
);

export const toggleYearlyTaskCompletion = createAsyncThunk(
  "yearlytask/toggleYearlyTaskCompletion",
  async (taskId) => {
    const response = await fetch(`/api/v1/yearlytask/yearly/${taskId}/toggle`, {
      method: "PATCH",
      credentials: "include",
    });
    return await response.json();
  }
);

export const deleteYearlyTask = createAsyncThunk(
  "yearlytask/deleteYearlyTask",
  async (taskId) => {
    await fetch(`/api/v1/yearlytask/yearly/${taskId}/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    return taskId;
  }
);

// Slice
const yearlyTaskSlice = createSlice({
  name: "yearlytask",
  initialState: { yearlyTask: [] },
  reducers: {
    calculateYearlyTaskProgress(state) {
      state.yearlyTask = state.yearlyTask.map((task) => {
        if (task?.isCompleted) return task;
        const progress = calculateMonthlyProgress(task.startDate, task.endDate);
        return { ...task, progress };
      });
    },
    setYearlyTaskProofWork(state, action) {
      state.yearlyTask = state.yearlyTask.map((task) => {
        if (task._id === action.payload.taskId) {
          return { ...task, proofOfWork: action.payload.fileURL };
        } else {
          return task;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchYearlyTasks.fulfilled, (state, action) => {
        state.yearlyTask = action.payload;
      })
      .addCase(addYearlyTask.fulfilled, (state, action) => {
        state.yearlyTask.push({ ...action.payload });
      })
      .addCase(toggleYearlyTaskCompletion.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.yearlyTask = state.yearlyTask.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
      })
      .addCase(deleteYearlyTask.fulfilled, (state, action) => {
        state.yearlyTask = state.yearlyTask.filter(
          (task) => task._id !== action.payload
        );
      });
  },
});
export const { calculateYearlyTaskProgress, setYearlyTaskProofWork } =
  yearlyTaskSlice.actions;
export default yearlyTaskSlice.reducer;
