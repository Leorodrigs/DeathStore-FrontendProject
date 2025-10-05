import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../components/authContext";
import apiService from "../components/apiService";

export const MyProfile = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.userId) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      const response = await apiService.findOne(user.id);
      setUserDetails(response);
    } catch (error) {
      setError("Erro ao carregar dados do perfil");
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Carregando seu perfil...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Você precisa estar logado para ver seu perfil.
          </div>
        </div>
      </div>
    );
  }

  const displayUser = {
    id: user?.sub,
    name: user?.name,
    email: user?.email,
    isAdmin: user?.isAdmin,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
                MEU PERFIL
              </h1>
            </div>
            <Link
              to="/home"
              className="text-lg bg-gradient-to-r from-gray-600 to-slate-500 hover:brightness-130 active:brightness-95 text-white border border-stone-600 font-normal md:font-medium py-1 md:py-2 px-2 md:px-4 rounded-lg transition-colors duration-200"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-stone-800 to-amber-950">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {displayUser.name}
                </h2>
                {displayUser?.isAdmin && (
                  <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full mt-2">
                    ADMINISTRADOR
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Identificação
                </dt>
                <dd className="text-lg text-gray-900">#{displayUser.id}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Nome Completo
                </dt>
                <dd className="text-lg text-gray-900">{displayUser?.name}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Email
                </dt>
                <dd className="text-lg text-gray-900">{displayUser?.email}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Status da Conta
                </dt>
                <dd>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
};
