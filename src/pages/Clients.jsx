import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import apiService from "../components/apiService";

export const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      setClients(response);
    } catch (error) {
      setError("Erro ao carregar clientes");
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clientId, clientName) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o cliente "${clientName}"?`
      )
    ) {
      try {
        await apiService.deleteUser(clientId);
        setClients(clients.filter((client) => client.id !== clientId));
        alert("Cliente excluído com sucesso!");
      } catch (error) {
        alert("Erro ao excluir cliente");
        console.error("Error deleting client:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Carregando clientes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-200">
      <Navbar />

      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
            CLIENTES
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-stone-800 to-amber-950">
                <tr>
                  <th className="px-3 py-4 md:px-6 md:py-4 text-left text-lg font-medium text-yellow-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-3 py-4 md:px-6 md:py-4 text-left text-lg font-medium text-yellow-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 py-4 md:px-6 md:py-4 text-center text-lg font-medium text-yellow-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-2 py-4 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-base font-medium text-gray-900">
                            {client.name}
                          </div>
                          {client.isAdmin && (
                            <div className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1">
                              ADMIN
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4 md:px-6 md:py-4 whitespace-nowrap text-base text-gray-500">
                      {client.email}
                    </td>
                    <td className="px-2 py-4 md:px-6 md:py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link
                          to={`/admin/clients/${client.id}/details`}
                          className="bg-blue-100 text-blue-600 cursor-pointer hover:bg-blue-200 p-2 rounded-full transition-colors duration-200"
                          title="Ver detalhes"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>

                        <Link
                          to={`/admin/clients/${client.id}/edit`}
                          className="bg-yellow-100 text-yellow-600 cursor-pointer hover:bg-yellow-200 p-2 rounded-full transition-colors duration-200"
                          title="Editar cliente"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>

                        <button
                          onClick={() => handleDelete(client.id, client.name)}
                          className="bg-red-100 text-red-600 cursor-pointer hover:bg-red-200 p-2 rounded-full transition-colors duration-200"
                          title="Excluir cliente"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {clients.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum cliente encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há clientes cadastrados no sistema.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
