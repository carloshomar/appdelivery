import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Texts from "../../constants/Texts";
import SignupPage from "./signup";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [cadastro, setCadastro] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      window.location = "/";
    } catch (error) {
      console.error("Erro de login:", error);
    }
  };

  if (cadastro) return <SignupPage />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 px-4 sm:px-6 ">
      <div className="max-w-md w-full">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {Texts.text_login}
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                {Texts.email_end}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {Texts.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-menu1 hover:text-menu2">
                {Texts.esqueceu_senha}
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-menu1 hover:bg-menu2 focus:outline-none focus:ring-2 focus:ring-offset-2 "
            >
              {Texts.entrar}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
