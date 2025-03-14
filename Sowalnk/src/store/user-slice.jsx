import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper function to get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async actions
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const token = getAuthToken();
  const response = await fetch(`/api/v1/user/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await response.json();
  return res.data;
});

export const updatePoints = createAsyncThunk(
  "user/updatePoints",
  async ({ userId, completed, taskId }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/update-points`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, completed, taskId }),
      });

      if (response.ok) {
        const res = await response.json();
        return res.data;
      }
    } catch (error) {
      console.error("Error updating points:", error);
    }
  }
);

export const increaseNormalCoins = createAsyncThunk(
  "user/increaseNormalCoins",
  async ({ userId, taskId }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/increase-normal-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, taskId }),
      });
      if (response.ok) {
        const res = await response.json();
        return res.data;
      }
    } catch (error) {
      console.error("Error increasing normal coins:", error);
    }
  }
);

export const increaseGoldCoins = createAsyncThunk(
  "user/increaseGoldCoins",
  async ({ userId, taskId }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/increase-gold-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, taskId }),
      });
      if (response.ok) {
        const res = await response.json();
        return res.data;
      }
    } catch (error) {
      console.error("Error increasing gold coins:", error);
    }
  }
);

export const increaseEliteCoins = createAsyncThunk(
  "user/increaseEliteCoins",
  async ({ userId, taskId }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/increase-elite-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, taskId }),
      });
      if (response.ok) {
        const res = await response.json();
        return res.data;
      }
    } catch (error) {
      console.error("Error increasing elite coins:", error);
    }
  }
);

export const convertNormalCoinsToCoupon = createAsyncThunk(
  "user/convertNormalCoinsToCoupon",
  async ({ userId }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/convert-normal-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const res = await response.json();
        return res.data;
      }
    } catch (error) {
      console.error("Error converting normal coins:", error);
    }
  }
);

export const convertGoldCoinsToCoupon = createAsyncThunk(
  "user/convertGoldCoinsToCoupon",
  async ({ userId }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/convert-gold-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const res = await response.json();
        return res.data;
      }
    } catch (error) {
      console.error("Error converting gold coins:", error);
    }
  }
);

export const convertEliteCoinsToCoupon = createAsyncThunk(
  "user/convertEliteCoinsToCoupon",
  async ({ userId }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/convert-elite-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (response.ok) {
        const res = await response.json();
        return res.data;
      }
    } catch (error) {
      console.error("Error converting elite coins:", error);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    taskPoint: [],
    loggedInUser: null,
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(updatePoints.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(increaseNormalCoins.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(increaseGoldCoins.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(increaseEliteCoins.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(convertNormalCoinsToCoupon.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(convertGoldCoinsToCoupon.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(convertEliteCoinsToCoupon.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      });
  },
});

export const { setLoggedInUser } = userSlice.actions;
export default userSlice.reducer;
