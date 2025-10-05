import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AdminNavbar } from "../components/AdminNavbar";
import apiService from "../components/apiService";

export const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProduct(parseInt(id));

      const productData = {
        name: response.name || "",
        brand: response.brand || "",
        category: response.category || "",
        price: response.price || "",
        stock: response.stock || "",
        description: response.description || "",
        imageUrl: response.imageUrl || "",
      };

      setFormData(productData);
      setOriginalData(productData);
    } catch (error) {
      setError("Erro ao carregar dados do produto");
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nome do produto é obrigatório");
      return false;
    }

    if (!formData.brand.trim()) {
      setError("Marca é obrigatória");
      return false;
    }

    if (!formData.category.trim()) {
      setError("Categoria é obrigatória");
      return false;
    }

    if (!formData.price || formData.price <= 0) {
      setError("Preço deve ser maior que zero");
      return false;
    }

    if (formData.stock === "" || formData.stock < 0) {
      setError("Estoque deve ser zero ou maior");
      return false;
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      setError("URL da imagem deve ser válida");
      return false;
    }

    return true;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const productData = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description.trim() || null,
        imageUrl: formData.imageUrl.trim() || null,
      };

      await apiService.updateProduct(parseInt(id), productData);

      setSuccess("Produto atualizado com sucesso!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      setError("Erro ao atualizar produto");
      console.error("Error updating product:", error);
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
            Carregando dados do produto...
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
                EDITAR PRODUTO
              </h1>
            </div>
            <Link
              to="/admin/products"
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
                <div className="w-auto h-20 bg-gray-200 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-fit"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64x64/cccccc/666666?text=IMG";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <svg
                        className="w-8 h-8 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {formData.name || "Produto"}
                  </h2>
                  <p className="text-gray-300">
                    ID: #{id} •{" "}
                    {formData.brand && formData.category
                      ? `${formData.brand} - ${formData.category}`
                      : "Informações do produto"}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg transition-colors"
                    placeholder="Ex: Sabre de Luz"
                  />
                </div>

                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Marca *
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg transition-colors"
                    placeholder="Ex: Império"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Categoria *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg transition-colors bg-white"
                  >
                    <option value="armas">Armas</option>
                    <option value="naves">Naves</option>
                    <option value="robos">Robôs</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg transition-colors"
                    placeholder="Ex: 999.90"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Quantidade em Estoque *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg transition-colors"
                    placeholder="Ex: 50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  URL da Imagem
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg transition-colors"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Deixe em branco se não tiver uma imagem
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg transition-colors resize-vertical"
                  placeholder="Descrição do produto"
                />
              </div>

              {formData.imageUrl && isValidUrl(formData.imageUrl) && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Preview da Imagem:
                  </h4>
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-auto h-32 object-fit rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div></div>

              <div className="flex space-x-3">
                <Link
                  to="/admin/products"
                  className="bg-gradient-to-r from-gray-300 to-slate-400 hover:brightness-130 active:brightness-95 text-stone-700 border border-stone-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 cursor-pointer hover:brightness-130 active:brightness-95 disabled:brightness-75 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center"
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
