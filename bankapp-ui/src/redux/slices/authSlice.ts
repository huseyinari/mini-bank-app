import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    isLoggedIn: false,
    jwtToken: null
  },
  reducers: {
    loginAction: (state, action) => {
      state.isLoggedIn = true;
      state.jwtToken = action.payload;
    },
    logoutAction: (state) => {
        state.isLoggedIn = false;
        state.jwtToken = null;
    }
  },
})

export const { loginAction, logoutAction } = authSlice.actions;

export default authSlice.reducer;