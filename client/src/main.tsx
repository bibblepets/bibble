import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Preloader from './Preloader';
import './index.css';
import Kennel from './modules/kennel/Kennel';
import Module2 from './modules/module2/Module2';
import Module3 from './modules/module3/Module3';
import { store } from './store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Kennel />
  },
  {
    path: '/module2',
    element: <Module2 />
  },
  {
    path: '/module3',
    element: <Module3 />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Preloader />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
