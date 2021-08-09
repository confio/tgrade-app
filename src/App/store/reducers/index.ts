import { combineReducers } from "redux";
import { dsosReducer } from "./dsosReducer";

export const rootReducer = combineReducers({ dsos: dsosReducer });
export type RootState = ReturnType<typeof rootReducer>;
