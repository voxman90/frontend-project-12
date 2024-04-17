/* eslint no-param-reassign: 0 */

import { createSlice } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channels';

const defaultChannelId = '1';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeChannelId: defaultChannelId,
    isChatContentLoaded: false,
  },
  reducers: {
    setActiveChannel(state, { payload }) {
      state.activeChannelId = payload;
    },
    setChatContentLoaded(state) {
      state.isChatContentLoaded = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const activeChannelId = state.id;
      const removedChannelId = action.payload;

      if (activeChannelId === removedChannelId) {
        state.activeChannel = defaultChannelId;
      }
    });
  },
});

export const { actions } = uiSlice;

export default uiSlice.reducer;
