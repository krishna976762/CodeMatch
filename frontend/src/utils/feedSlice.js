import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [], // always an array
  reducers: {
    addFeed: (state, action) => {
      // make sure state is an array
      return Array.isArray(action.payload)
        ? action.payload
        : action.payload.data || [];
    },
    removeUserFromFeed: (state, action) => {
      // state is always an array now
      return state.filter((user) => user._id !== action.payload);
    },
  },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
