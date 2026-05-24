import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import dashboardSubscriptionReducer from './dashboardSubscriptionSlice';
import userPermissionReducer from './userPermissionsSlice';
import userProfileReducer from './userProfileSlice';

export const store = configureStore({
  reducer: {
    dashboardSubscription: dashboardSubscriptionReducer,
    userProfile: userProfileReducer,
    userPermissions: userPermissionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
