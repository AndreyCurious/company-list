import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "./companySlice";

export type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    company: companyReducer,
  },
});

export default store;
