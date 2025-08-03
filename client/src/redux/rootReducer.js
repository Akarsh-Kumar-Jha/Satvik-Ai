import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../redux/slices/AuthSlice';

export const rootReducer = combineReducers({
    auth: authReducer
});