import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../components/authContext";
import apiService from "../components/apiService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiService.login(email, password);
      login(response.access_token, response.user);
    } catch (error) {
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-b from-white to-stone-900 p-4">
      <div className="w-full md:w-2/5 flex items-center justify-center px-4 py-6 md:order-2">
        <div className="w-full max-w-md">
          <h1 className="text-4xl md:text-6xl text-center mb-6 md:mb-8 font-bold text-yellow-400 [text-shadow:_-2px_-2px_0_#000,_2px_-2px_0_#000,_-2px_2px_0_#000,_2px_2px_0_#000,_-2px_0px_0_#000,_2px_0px_0_#000,_0px_-2px_0_#000,_0px_2px_0_#000,_0px_3px_5px_rgba(0,0,0,0.5)] md:[text-shadow:_-3px_-3px_0_#000,_3px_-3px_0_#000,_-3px_3px_0_#000,_3px_3px_0_#000,_-3px_0px_0_#000,_3px_0px_0_#000,_0px_-3px_0_#000,_0px_3px_0_#000,_0px_4px_6px_rgba(0,0,0,0.5)] leading-tight">
            Login
          </h1>

          {error && (
            <div className="text-red-600 text-sm text-center mb-4 bg-red-100 border border-red-400 rounded px-4 py-2">
              {error}
            </div>
          )}

          <form
            className="flex flex-col space-y-4 md:space-y-6 w-full"
            onSubmit={handleSubmit}
          >
            <div className="relative w-full">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full bg-yellow-200 border border-yellow-800 rounded px-4 py-3 text-black transition focus:outline-none focus:border-amber-500 focus:bg-amber-400"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative w-full">
              <input
                type="password"
                id="password"
                name="password"
                className="w-full bg-yellow-200 border border-yellow-800 rounded px-4 py-3 text-black transition focus:outline-none focus:border-amber-500 focus:bg-amber-400"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-1/2 bg-gradient-to-br from-yellow-200 to-amber-400 font-semibold text-stone-900 px-4 py-2 rounded shadow-md border border-yellow-800 transition-all duration-300 cursor-pointer hover:shadow-lg hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4 md:mt-6">
            <p className="text-stone-200 text-sm">
              Novo aqui?{" "}
              <Link
                to="/signup"
                className="text-yellow-400 font-medium hover:text-yellow-600 hover:underline transition-colors duration-200"
              >
                Crie sua conta
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 flex justify-center md:justify-start px-4 md:order-1">
        <img
          src="/Logo.png"
          alt="Logo"
          className="w-64 h-64 md:w-full md:h-auto md:max-w-lg lg:max-w-2xl object-contain"
        />
      </div>
    </div>
  );
};
