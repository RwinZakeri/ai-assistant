import type { GetCurrentAppUserProfilePictureOutput } from "@/apis/models/GetCurrentAppUserProfilePictureOutput";
import type { GetUserProfileDetailOutput } from "@/apis/models/GetUserProfileDetailOutput";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfileState {
  data: GetUserProfileDetailOutput | null;
  profilePicture: GetCurrentAppUserProfilePictureOutput | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  data: null,
  profilePicture: null,
  loading: false,
  error: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<GetUserProfileDetailOutput>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setProfilePicture(
      state,
      action: PayloadAction<GetCurrentAppUserProfilePictureOutput>
    ) {
      state.profilePicture = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearUserProfile(state) {
      state.data = null;
      state.profilePicture = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setUserProfile,
  setProfilePicture,
  setLoading,
  setError,
  clearUserProfile,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
