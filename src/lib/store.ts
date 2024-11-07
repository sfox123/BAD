import { configureStore } from "@reduxjs/toolkit";
import animationReducer from "./feature/animationSlice";
import teamReducer from "./feature/teamSlice";
import matchReducer from "./feature/matchSlice";

const store = configureStore({
  reducer: {
    animation: animationReducer,
    team: teamReducer,
    match: matchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
