// import { createAction, createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "../../app/store";

// export interface QuestionFromEndpoint {
//   is_active: boolean;
//   id: string;
//   title: string;
//   choices: QuestionChoice[];
//   endpointURL: string;
// }

// export interface QuestionChoice {
//   description: string;
//   votes: null | number; // Votes only come in if we specify a parameter
//   id: string;
// }

// const initialState = {
//   // To keep track if we're re-fetching based on user input. Explained more on updateLoading action
//   isLoading: [] as string[],
//   // the Base URL for the voting game, dynamically set per page
//   baseURL: "",
// };

// // Update if the numbers are loading
// // This gets an ID added when a vote occurs and is set to false after every time
// // an API call is completed. Note: This is not set to true on every poll request
// // it is only a way to show the user we're fetching data after _they_ vote
// //
// // This solves the problem of when the user sees the score of their vote increase
// // without the size of the bar changing
// type isLoading = {
//   id: string;
//   loading: boolean; // if true, add to the array if not there, if false, remove
// };
// export const updateLoading = createAction<isLoading>(
//   "votingGameSlice/updateLoading"
// );
// export const setBaseURL = createAction<string>("votingGameSlice/setBaseURL");

// export const votingGameSlice = createSlice({
//   name: "votingGameSlice",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(updateLoading, (state, action) => {
//         // If the state is loading, and the id isn't already present, add it
//         if (action.payload.loading === true) {
//           if (!state.isLoading.includes(action.payload.id)) {
//             state.isLoading.push(action.payload.id);
//             return;
//           }
//         }
//         // if the state isn't loading, clear all loading indicators
//         // (all ID's are requested from the same place)
//         if (action.payload.loading === false) {
//           state.isLoading = [];
//         }
//       })
//       .addCase(setBaseURL, (state, action) => {
//         state.baseURL = action.payload;
//       });
//   },
// });

// export const selectVotingGame = (state: RootState) => state.votingGameReducer;

// export default votingGameSlice.reducer;

export {}