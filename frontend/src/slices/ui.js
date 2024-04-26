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

const modalType = {
  addChannel: 'addChannel',
  deleteChannel: 'deleteChannel',
  renameChannel: 'renameChannel',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeChannelId: defaultChannelId,
    isChatContentLoaded: false,
    modal: {
      type: null,
      channelId: null,
      isShown: false,
    },
  },
  reducers: {
    setActiveChannel(state, { payload }) {
      state.activeChannelId = payload;
    },
    setChatContentLoaded(state) {
      state.isChatContentLoaded = true;
    },
    closeModal(state) {
      state.modal.isShown = false;
      state.modal.type = null;
      state.modal.channelId = null;
    },
    openModal(state, { payload }) {
      const { channelId, type } = payload;
      state.modal.isShown = true;
      state.modal.type = type;
      state.modal.channelId = channelId;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, { payload: removedChannelId }) => {
      const { activeChannelId } = state;

      if (activeChannelId === removedChannelId) {
        state.activeChannelId = defaultChannelId;
      }
    });
  },
});

export { msgFormStatus, modalType };

export const { actions } = uiSlice;

export default uiSlice.reducer;
