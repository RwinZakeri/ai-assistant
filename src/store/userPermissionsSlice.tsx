import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type PermissionsState = {
  permissions: string[] | null;
  isLoading: boolean;
};

const initialState: PermissionsState = {
  permissions: null,
  isLoading: true,
};

export const userPermissionsSlice = createSlice({
  name: 'userPermissions',
  initialState,
  reducers: {
    setPermission: (state, action: PayloadAction<string[] | null>) => {
      state.permissions = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: state => {
      state.permissions = null;
      state.isLoading = false;
    },
  },
});

export const { setPermission, setLoading, logout } =
  userPermissionsSlice.actions;

export default userPermissionsSlice.reducer;
