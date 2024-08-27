import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist-indexeddb-storage";
import { composeWithDevTools } from "@redux-devtools/extension";
import counterReducer from "./slices/counter";
import usersReducer from "./slices/users";
import questionsReducer from "./slices/questions";
import subjectsReducer from "./slices/subjects";
import paypalReducer from "./slices/paypal";
import usertestsReducer from "./slices/usertests";
import dashboardReducer from "./slices/dashboard";
import onlinestatusReducer from "./slices/onlinestatus";
import landingReducer from "./slices/landing";

const persistConfig = {
  key: "root",
  storage: storage("offlinebase"),
  whitelist: ["questions", "subjects"], // Add reducers that you want to persist here
};

// Create the persisted root reducer
const rootReducer = combineReducers({
  users: usersReducer,
  questions: questionsReducer,
  counter: counterReducer,
  subjects: subjectsReducer,
  paypal: paypalReducer,
  usertests: usertestsReducer,
  dashboard: dashboardReducer,
  onlinestatus: onlinestatusReducer,
  content: landingReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create the persistor
export const persistor = persistStore(store);
