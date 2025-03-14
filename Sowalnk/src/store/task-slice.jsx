import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { calculateProgress } from "../utils/calculateProgress";
// Async actions
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async actions
export const fetchTasks = createAsyncThunk("task/fetchTasks", async () => {
  const token = getAuthToken();
  const response = await fetch(`/api/v1/task/daily`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
});

export const addTask = createAsyncThunk("task/addTask", async (task) => {
  const token = getAuthToken();
  const response = await fetch(`/api/v1/task/daily`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  });
  return await response.json();
});

export const toggleTaskCompletion = createAsyncThunk(
  "task/toggleTaskCompletion",
  async (taskId) => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/task/daily/${taskId}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  }
);

export const toggleHasExceededTime = createAsyncThunk(
  "task/toggleHasExceededTime",
  async (taskId) => {
    const token = getAuthToken();
    try {
      const response = await fetch(
        `/api/v1/task/daily/${taskId}/togglehasexceededtime`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle exceeded time status");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId) => {
    const token = getAuthToken();
    await fetch(`/api/v1/task/daily/${taskId}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return taskId;
  }
);
// Slice
const taskSlice = createSlice({
  name: "task",
  initialState: { dailyTask: [] },
  reducers: {
    calculateTaskProgress(state) {
      state.dailyTask = state.dailyTask.map((task) => {
        if (task?.isCompleted) return task;

        const progress = calculateProgress(
          task?.startTime,
          task?.endTime,
          task?.hasExceededTime
        );
        return { ...task, progress };
      });
    },
    setDailyTaskProofWork(state, action) {
      state.dailyTask = state.dailyTask.map((task) => {
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
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.dailyTask = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.dailyTask.push({ ...action.payload });
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.dailyTask = state.dailyTask.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.dailyTask = state.dailyTask.filter(
          (task) => task._id !== action.payload
        );
      })
      .addCase(toggleHasExceededTime.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.dailyTask = state.dailyTask.map((task) =>
          task._id === updatedTask._id
            ? {
                ...updatedTask,
                progress: 100,
                hasExceededTime: true,
              }
            : task
        );
      });
  },
});
export const { calculateTaskProgress, setDailyTaskProofWork } =
  taskSlice.actions;
export default taskSlice.reducer;
