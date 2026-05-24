import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GetDashboardSubscriptionOutput } from "@/apis/models/GetDashboardSubscriptionOutput";

interface DashboardSubscriptionState {
  data: GetDashboardSubscriptionOutput | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardSubscriptionState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardSubscriptionSlice = createSlice({
  name: "dashboardSubscription",
  initialState,
  reducers: {
    setDashboardSubscription(state, action: PayloadAction<GetDashboardSubscriptionOutput>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearDashboardSubscription(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setDashboardSubscription,
  setLoading,
  setError,
  clearDashboardSubscription,
} = dashboardSubscriptionSlice.actions;

export default dashboardSubscriptionSlice.reducer;
