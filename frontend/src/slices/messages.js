/* eslint no-param-reassign: 0 */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channels';

const messagesAdapter = createEntityAdapter();

const selectors = messagesAdapter.getSelectors();

const messagesSelectors = messagesAdapter.getSelectors((state) => state.messages);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    removeMessage: messagesAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, { payload: removedChannelId }) => {
      const newMessages = selectors.selectAll(state)
        .filter(({ channelId }) => channelId !== removedChannelId);
      messagesAdapter.setAll(state, newMessages);
    });
  },
});

export const { actions } = messagesSlice;

export { messagesSelectors };

export default messagesSlice.reducer;
