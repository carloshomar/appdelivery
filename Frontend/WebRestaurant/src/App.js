import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import React, { useEffect } from "react";

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
