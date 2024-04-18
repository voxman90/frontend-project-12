/* eslint no-param-reassign: 0 */

import { createSlice } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channels';

const defaultChannelId = '1';

const msgFormStatus = {
  ready: 'ready',
  pending: 'pending',
  success: 'success',
  failure: 'failure',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeChannelId: defaultChannelId,
    isChatContentLoaded: false,
    msgForm: {
      status: msgFormStatus.ready,
      error: null,
    },
  },
  reducers: {
    setActiveChannel(state, { payload }) {
      state.activeChannelId = payload;
    },
    setChatContentLoaded(state) {
      state.isChatContentLoaded = true;
    },
    setMsgFormStatus(state, { payload }) {
      state.msgForm.state = payload;
    },
    setMsgFormError(state, { payload }) {
      state.msgForm.error = payload;
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

export { msgFormStatus };

export const { actions } = uiSlice;

export default uiSlice.reducer;
