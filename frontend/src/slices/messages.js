/* eslint no-param-reassign: 0 */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    ids: [],
    entities: {},
  },
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    removeMessage: messagesAdapter.removeOne,
  },
});

export const { actions } = messagesSlice;

export default messagesSlice.reducer;
