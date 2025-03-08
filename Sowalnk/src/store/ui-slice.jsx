import { createSlice } from "@reduxjs/toolkit";

const uiReducer = createSlice({
  name: "ui",
  initialState: {
    intermediateMember: false,
    advanceMember: false,
  },
  reducers: {
    setIntermediateMember(state, action) {
      state.intermediateMember = action.payload;
    },
    setAdvanceMember(state, action) {
      state.advanceMember = action.payload;
    },
  },
});

export const { setIntermediateMember, setAdvanceMember } = uiReducer.actions;
export const uiReducerFun = uiReducer.reducer;
