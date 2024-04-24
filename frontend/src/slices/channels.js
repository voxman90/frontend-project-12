/* eslint no-param-reassign: 0 */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const selectors = channelsAdapter.getSelectors();

const channelsSelectors = channelsAdapter.getSelectors((state) => state.channels);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState(),
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
    renameChannel(state, { payload: { id, name } }) {
      const renamedChannel = selectors.selectById(state, id);
      channelsAdapter.setOne(state, { ...renamedChannel, name });
    },
  },
});

export const { actions } = channelsSlice;

export { channelsSelectors };

export default channelsSlice.reducer;
