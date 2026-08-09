import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
<<<<<<< HEAD
import { Provider } from 'react-redux';
import { store } from './services/store'; // Импорт store
=======
>>>>>>> 491ec180fb55cb0b9b556214cef1ba9dca534cc6
import App from './components/app/app';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <Provider store={store}>
      {' '}
      {/* Обертываем App в Provider */}
      <App />
    </Provider>
=======
    <App />
>>>>>>> 491ec180fb55cb0b9b556214cef1ba9dca534cc6
  </React.StrictMode>
);
