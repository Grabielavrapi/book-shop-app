import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Landing from './pages/Landing';
import NotFound from './components/NotFound';
import SignIn from './components/SignIn';
import './index.css';

const getToken = async () => {
  return await new Promise((resolve) => setTimeout(() => resolve('dummy-token'), 1000));
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    loader: async () => {
      const token = await getToken();
      if (!token) {
        throw new Response('', { status: 401, statusText: 'Unauthorized' });
      }
      return { token };
    },
    errorElement: <NotFound />,
    children: [
      {
        path: 'logout',
        element: <SignIn />,
      },
    ],
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
