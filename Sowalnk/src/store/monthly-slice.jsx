import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { calculateMonthlyProgress } from "../utils/calculateMonthlyProgress.jsx";
// Async actions
const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const fetchMonthlyTasks = createAsyncThunk(
  "weeklytask/fetchMonthlyTasks",
  async () => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/monthlytask/monthly`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }
);

export const addMonthlyTask = createAsyncThunk(
  "monthlytask/addMonthlyTask",
  async (task) => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/monthlytask/monthly`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });
    return await response.json();
  }
);

export const toggleMonthlyTaskCompletion = createAsyncThunk(
  "monthlytask/toggleMonthlyTaskCompletion",
  async (taskId) => {
    const token = getAuthToken();
    const response = await fetch(
      `/api/v1/monthlytask/monthly/${taskId}/toggle`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  }
);

export const deleteMonthlyTask = createAsyncThunk(
  "monthlytask/deleteMonthlyTask",
  async (taskId) => {
    const token = getAuthToken();
    await fetch(`/api/v1/monthlytask/monthly/${taskId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return taskId;
  }
);

// Slice
const monthlyTaskSlice = createSlice({
  name: "monthlytask",
  initialState: { monthlyTask: [] },
  reducers: {
    calculateMonthlyTaskProgress(state) {
      state.monthlyTask = state.monthlyTask.map((task) => {
        if (task?.isCompleted) return task;
        const progress = calculateMonthlyProgress(task.startDate, task.endDate);
        return { ...task, progress };
      });
    },
    setMonthlyTaskProofWork(state, action) {
      state.monthlyTask = state.monthlyTask.map((task) => {
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
      .addCase(fetchMonthlyTasks.fulfilled, (state, action) => {
        state.monthlyTask = action.payload;
      })
      .addCase(addMonthlyTask.fulfilled, (state, action) => {
        state.monthlyTask.push({ ...action.payload });
      })
      .addCase(toggleMonthlyTaskCompletion.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.monthlyTask = state.monthlyTask.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
      })
      .addCase(deleteMonthlyTask.fulfilled, (state, action) => {
        state.monthlyTask = state.monthlyTask.filter(
          (task) => task._id !== action.payload
        );
      });
  },
});
export const { calculateMonthlyTaskProgress, setMonthlyTaskProofWork } =
  monthlyTaskSlice.actions;
export default monthlyTaskSlice.reducer;
