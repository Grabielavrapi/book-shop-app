import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store/store";
import Landing from "./pages/Landing";
import NotFound from "./components/NotFound";
import SignIn from "./components/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role;
};

const loader = () => {
  if (!isAuthenticated()) {
    return redirect("/");
  }
  const role = getUserRole();
  return { token: localStorage.getItem("token"), role };
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/landing",
    element: (
      <ProtectedRoute allowedRoles={["user", "admin"]}>
        <Landing />
      </ProtectedRoute>
    ),
    loader,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
