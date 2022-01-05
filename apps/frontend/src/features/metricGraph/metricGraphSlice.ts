import { createAction, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

const initialState = {
  // the Base URL for the metrics, dynamically set per page
  baseURL: "",
};

export const setMetricsBaseURL = createAction<string>(
  "metricGraphSlice/setBaseURL"
);

export const metricGraphSlice = createSlice({
  name: "metricGraphSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setMetricsBaseURL, (state, action) => {
      state.baseURL = action.payload;
    });
  },
});

export const selectMetricGraph = (state: RootState) => state.metricsReducer;

export default metricGraphSlice.reducer;
