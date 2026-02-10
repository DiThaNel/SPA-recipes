import { configureStore } from "@reduxjs/toolkit";
import weekPlanReducer from "./weekPlanSlice";
import recipeBankReducer from "./recipeBankSlice";

export const store = configureStore({
  reducer: {
    weekPlan: weekPlanReducer,
    recipeBank: recipeBankReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
