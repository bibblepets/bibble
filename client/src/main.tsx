import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom';
import Preloader from './Preloader';
import ModalProvider from './components/modals/ModalProvider';
import './index.css';
import Kennel from './modules/Kennel';
import { store } from './store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/explore" />
  },
  {
    path: '/explore',
    element: <Kennel />
  }
]);

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
