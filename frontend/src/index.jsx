import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import i18next from 'i18next';
import * as LeoProfanity from 'leo-profanity';
import { io } from 'socket.io-client';

import App from './components/App.jsx';
import { actions as channelsActions } from './slices/channels.js';
import { actions as messagesActions } from './slices/messages.js';
import resources from './locales/index.js';
import store from './slices/index.js';
import { LeoProfanityContext } from './context/filter.js';

import reportWebVitals from './reportWebVitals.js';

const rollbarConfig = {
  accessToken: process.env.ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: 'production',
};

const i18nextConfig = {
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
};

const subscribeToServerEvents = () => {
  const socket = io();

  socket.on('newMessage', (payload) => {
    store.dispatch(messagesActions.addMessage(payload));
  });

  socket.on('newChannel', (payload) => {
    store.dispatch(channelsActions.addChannel(payload));
  });

  socket.on('renameChannel', ({ name, id }) => {
    store.dispatch(channelsActions.renameChannel({ id, name }));
  });

  socket.on('removeChannel', ({ id }) => {
    store.dispatch(channelsActions.removeChannel(id));
  });
};

const app = async () => {
  await i18next
    .use(initReactI18next)
    .init(i18nextConfig);

  subscribeToServerEvents();

  document.body.classList.add('bg-light', 'h-100');

  const root = createRoot(document.getElementById('root'));

  root.render(
    <React.StrictMode>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <Provider store={store}>
            <LeoProfanityContext.Provider value={LeoProfanity}>
              <I18nextProvider i18n={i18next} defaultNS="translation">
                <App />
              </I18nextProvider>
            </LeoProfanityContext.Provider>
          </Provider>
        </ErrorBoundary>
      </RollbarProvider>
    </React.StrictMode>,
  );
};

app();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
