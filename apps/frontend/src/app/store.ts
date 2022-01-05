import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import votingGameReducer from "../features/votingGame/votingGameSlice";
import metricsReducer from "../features/metricGraph/metricGraphSlice";

import { votingGameAPI } from "../features/votingGame/votingGameAPI";
import { metricsAPI } from "../features/metricGraph/metricsGraphAPI";

const rootReducer = combineReducers({
  metricsReducer: metricsReducer,
  votingGameReducer: votingGameReducer,
  [votingGameAPI.reducerPath]: votingGameAPI.reducer,
  [metricsAPI.reducerPath]: metricsAPI.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(votingGameAPI.middleware)
      .concat(metricsAPI.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
