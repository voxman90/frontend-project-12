/* eslint no-param-reassign: 0 */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const defaultChannelId = '1';

const channelsAdapter = createEntityAdapter();

const selectors = channelsAdapter.getSelectors();

const channelsSelectors = channelsAdapter.getSelectors((state) => state.channels);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({
    activeChannelId: defaultChannelId,
    isChannelsLoaded: false,
  }),
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel(state, { payload: removedChannelId }) {
      if (state.activeChannelId === removedChannelId) {
        state.activeChannelId = defaultChannelId;
      }

      channelsAdapter.removeOne(state, removedChannelId);
    },
    renameChannel(state, { payload: { id, name } }) {
      const renamedChannel = selectors.selectById(state, id);

      channelsAdapter.setOne(state, { ...renamedChannel, name });
    },
    setActiveChannel(state, { payload }) {
      state.activeChannelId = payload;
    },
    setChannelsLoaded(state) {
      state.isChannelsLoaded = true;
    },
  },
});

export const { actions } = channelsSlice;

export { channelsSelectors };

export default channelsSlice.reducer;
