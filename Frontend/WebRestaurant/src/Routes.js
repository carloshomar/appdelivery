import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/login";
import Home from "./pages/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cardapio from "./pages/cardapio/products/Cardapio";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/gestor-cardapio",
    element: <Cardapio />,
  },
]);

export default function PrivateRoute() {
  const { user } = useAuth();

  return user ? <RouterProvider router={router} /> : <LoginPage />;
}
