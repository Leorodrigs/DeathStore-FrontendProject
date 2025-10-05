import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AdminNavbar } from "../components/AdminNavbar";
import apiService from "../components/apiService";

export const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const client = await apiService.findOne(parseInt(id));

      setFormData({
        name: client.name || "",
        email: client.email || "",
        isAdmin: client.isAdmin || false,
      });
    } catch (error) {
      setError("Erro ao carregar dados do cliente");
      console.error("Error fetching client:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Email deve ter formato válido");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      await apiService.updateUser(parseInt(id), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        isAdmin: formData.isAdmin,
      });

      setSuccess("Cliente atualizado com sucesso!");

      setTimeout(() => {
        navigate("/admin/clients");
      }, 2000);
    } catch (error) {
      setError("Erro ao atualizar cliente");
      console.error("Error updating client:", error);
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                EDITAR CLIENTE
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 bg-gradient-to-r from-stone-800 to-amber-950">
              <div className="flex items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {formData.name}
                  </h2>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg transition-colors"
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg transition-colors"
                  placeholder="Digite o email"
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="isAdmin" className="ml-3 cursor-pointer">
                    <div className="text-sm font-medium text-gray-900">
                      Permissões de Administrador
                    </div>
                  </label>
                </div>

                {formData.isAdmin && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                      <svg
                        className="w-5 h-5 text-red-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-red-800 font-medium">
                          Atenção!
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                          Usuários admin têm acesso total ao sistema. Use com
                          cuidado.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <Link
                to={`/admin/clients/${id}/details`}
                className="bg-gradient-to-r from-gray-600 to-slate-500 hover:brightness-130 active:brightness-95 text-white border border-stone-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Ver Detalhes
              </Link>

              <div className="flex space-x-3">
                <Link
                  to="/admin/clients"
                  className="bg-gradient-to-r from-gray-300 to-slate-400 hover:brightness-130 active:brightness-95 text-stone-700 border border-stone-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 cursor-pointer hover:brightness-130 active:brightness-95 text-white border border-amber-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
