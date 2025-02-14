import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import authSlice from "./Slice/authSlice";
import materialListSlice from "./Slice/materialListSlice";
import projectSlice from "./Slice/projectSlice";
import filesSlice from "./Slice/filesSlice";
import globalSlice from "./Slice/globalSlice";
import afterControlFormSlice from "./Slice/afterControlFormSlice";
import materialListWithProjectSlice from "./Slice/materialListWithProjectSlice";
import subscriptionSlice from "./Slice/subscriptionSlice";
import adminSlice from "./Slice/adminSlice";
import scaffoldReducer from "./Slice/scaffoldTypeSlice";

export const persistConfig = {
  key: "Salus-Stillas",
  version: 1,
  storage,
  whitelist: ["auth", "scaffolds"]
};
const combinedReducer = combineReducers({
  auth: authSlice,
  materialList: materialListSlice,
  project: projectSlice,
  file: filesSlice,
  global: globalSlice,
  afterControl: afterControlFormSlice,
  materialListWithProject: materialListWithProjectSlice,
  subscription: subscriptionSlice,
  admin: adminSlice,
  scaffolds: scaffoldReducer
});

const rootReducer = (state, action) => {
  return combinedReducer(state, action);
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
