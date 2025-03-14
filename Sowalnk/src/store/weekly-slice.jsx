import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { calculateWeeklyProgress } from "../utils/calculateWeeklyProgress";
// Async actions
const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const fetchWeeklyTasks = createAsyncThunk(
  "weeklytask/fetchWeeklyTasks",
  async () => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/weeklytask/weekly`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }
);

export const addWeeklyTask = createAsyncThunk(
  "weeklytask/addWeeklyTask",
  async (task) => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/weeklytask/weekly`, {
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

export const toggleWeeklyTaskCompletion = createAsyncThunk(
  "weeklytask/toggleWeeklyTaskCompletion",
  async (taskId) => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/weeklytask/weekly/${taskId}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }
);

export const deleteWeeklyTask = createAsyncThunk(
  "weeklytask/deleteWeeklyTask",
  async (taskId) => {
    const token = getAuthToken();
    await fetch(`/api/v1/weeklytask/weekly/${taskId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return taskId;
  }
);

// Slice
const weeklyTaskSlice = createSlice({
  name: "weeklytask",
  initialState: { weeklyTask: [] },
  reducers: {
    calculateWeeklyTaskProgress(state) {
      state.weeklyTask = state.weeklyTask.map((task) => {
        if (task?.isCompleted) return task;
        const progress = calculateWeeklyProgress(task);
        return { ...task, progress };
      });
    },
    setWeeklyTaskProofWork(state, action) {
      state.weeklyTask = state.weeklyTask.map((task) => {
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
      .addCase(fetchWeeklyTasks.fulfilled, (state, action) => {
        state.weeklyTask = action.payload;
      })
      .addCase(addWeeklyTask.fulfilled, (state, action) => {
        state.weeklyTask.push({ ...action.payload });
      })
      .addCase(toggleWeeklyTaskCompletion.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.weeklyTask = state.weeklyTask.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
      })
      .addCase(deleteWeeklyTask.fulfilled, (state, action) => {
        state.weeklyTask = state.weeklyTask.filter(
          (task) => task._id !== action.payload
        );
      });
  },
});
export const { calculateWeeklyTaskProgress, setWeeklyTaskProofWork } =
  weeklyTaskSlice.actions;
export default weeklyTaskSlice.reducer;
