import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/login";
import Home from "./pages/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EditMenuPage from "./pages/cardapio/products/EditMenuPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/cardaipo/produtos",
    element: <EditMenuPage />,
  },
]);

export default function PrivateRoute() {
  const { user } = useAuth();

  return user ? <RouterProvider router={router} /> : <LoginPage />;
}
