/* eslint no-param-reassign: 0 */

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: JSON.parse(localStorage.getItem('user')) || {},
  reducers: {
    login(state, { payload }) {
      localStorage.setItem('user', JSON.stringify(payload));
      state.username = payload.username;
      state.token = payload.token;
    },
    logout(state) {
      localStorage.removeItem('user');
      state.username = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
