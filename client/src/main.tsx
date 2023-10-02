import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import Preloader from './Preloader';
import ModalProvider from './components/modals/ModalProvider';
import './index.css';
import { router } from './router';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Preloader />
      <Toaster />
      <ModalProvider />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
