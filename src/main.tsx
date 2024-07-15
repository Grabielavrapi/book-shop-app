import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/Landing';
import NotFound from './components/NotFound';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importo Bootstrap CSS

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    loader: async () => {
      // Simulimi i marrjes së një token
      const token = await new Promise((resolve) => setTimeout(() => resolve('dummy-token'), 1000));
      return { token };
    },
    errorElement: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
