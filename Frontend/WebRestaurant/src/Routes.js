import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/login";
import Home from "./pages/home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cardapio from "./pages/cardapio/products/Cardapio";
import Perfil from "./pages/perfil";
import Taxes from "./pages/perfil/taxes";
import Delivery from "./pages/delivery";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/gestor-cardapio",
    element: <Cardapio />,
  },
  {
    path: "/perfil",
    element: <Perfil />,
  },
  {
    path: "/taxas",
    element: <Taxes />,
  },
  {
    path: "/delivery-avulso",
    element: <Delivery />,
  },
]);

export default function PrivateRoute() {
  const { user } = useAuth();

  return user ? <RouterProvider router={router} /> : <LoginPage />;
}
