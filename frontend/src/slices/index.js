import { configureStore } from '@reduxjs/toolkit';

import auth from './auth.js';
import channels from './channels.js';
import messages from './messages.js';
import ui from './ui.js';

const store = configureStore({
  reducer: {
    auth,
    channels,
    messages,
    ui,
  },
});

export default store;
