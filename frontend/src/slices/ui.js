/* eslint no-param-reassign: 0 */

import { createSlice } from '@reduxjs/toolkit';

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
    modal: {
      type: null,
      channelId: null,
      isShown: false,
    },
  },
  reducers: {
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
});

export { msgFormStatus, modalType };

export const { actions } = uiSlice;

export default uiSlice.reducer;
