import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Business from './business/Business';
import './index.css';
import Kennel from './kennel/Kennel';
import Messages from './messages/Messages';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Kennel />,
	},
	{
		path: '/business',
		element: <Business />,
	},
	{
		path: '/messages',
		element: <Messages />,
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
