import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import i18next from 'i18next';
import { io } from 'socket.io-client';
import { initReactI18next, I18nextProvider } from 'react-i18next';

import resources from './locales/index.js';
import store from './slices/index.js';
import App from './components/App.jsx';
import { SocketContext } from './context/socket';

import reportWebVitals from './reportWebVitals.js';

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

const socket = io();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <I18nextProvider i18n={i18next} defaultNS="translation">
          <App />
        </I18nextProvider>
      </SocketContext.Provider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
