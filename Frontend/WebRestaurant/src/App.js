import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <AuthProvider>
      <Routes />
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
