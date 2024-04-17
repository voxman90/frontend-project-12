/* eslint no-param-reassign: 0 */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
  },
});

export const { actions } = channelsSlice;

export default channelsSlice.reducer;
