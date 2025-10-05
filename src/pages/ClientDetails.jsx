import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { AdminNavbar } from "../components/AdminNavbar";
import apiService from "../components/apiService";

export const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await apiService.findOne(parseInt(id));
      setClient(response);
    } catch (error) {
      setError("Erro ao carregar dados do cliente");
      console.error("Error fetching client:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">
            Carregando dados do cliente...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
                DETALHES DO CLIENTE
              </h1>
            </div>
            <Link
              to="/admin/clients"
              className="bg-gradient-to-r from-gray-600 to-slate-500 hover:brightness-130 active:brightness-95 text-white border border-stone-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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
                  {client?.name}
                </h2>
                <p className="text-gray-300">{client?.email}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Identificação
                </dt>
                <dd className="text-lg text-gray-900">#{client?.id}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Nome Completo
                </dt>
                <dd className="text-lg text-gray-900">{client?.name}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Email
                </dt>
                <dd className="text-lg text-gray-900">{client?.email}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Tipo de Usuário
                </dt>
                <dd>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      client?.isAdmin
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {client?.isAdmin ? "Administrador" : "Cliente"}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Data de Cadastro
                </dt>
                <dd className="text-lg text-gray-900">
                  {client?.createdAt
                    ? new Date(client.createdAt).toLocaleDateString("pt-BR")
                    : "Não disponível"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Última Atualização
                </dt>
                <dd className="text-lg text-gray-900">
                  {client?.updatedAt
                    ? new Date(client.updatedAt).toLocaleDateString("pt-BR")
                    : "Não disponível"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <Link
                to={`/admin/clients/${client?.id}/edit`}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-130 active:brightness-95 text-white border border-amber-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Editar Cliente
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
