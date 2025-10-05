import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { AdminNavbar } from "../components/AdminNavbar";
import apiService from "../components/apiService";

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProduct(parseInt(id));
      setProduct(response);
    } catch (error) {
      setError("Erro ao carregar dados do produto");
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "R$ 0,00";
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { color: "bg-red-100 text-red-800", text: "Sem estoque" };
    } else if (stock <= 5) {
      return { color: "bg-yellow-100 text-yellow-800", text: "Estoque baixo" };
    } else {
      return { color: "bg-green-100 text-green-800", text: "Em estoque" };
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

  const stockStatus = getStockStatus(product?.stock);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
                DETALHES DO PRODUTO
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

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-stone-800 to-amber-950">
            <div className="flex items-center">
              <div className="w-auto h-20 bg-gray-200 rounded-lg overflow-hidden mr-6 flex-shrink-0">
                {product?.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-fit"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x80/cccccc/666666?text=IMG";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <svg
                      className="w-10 h-10 text-gray-500"
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
                  {product?.name}
                </h2>
                <p className="text-gray-300 capitalize">
                  {product?.brand} - {product?.category}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}
                  >
                    {stockStatus.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Identificação
                </dt>
                <dd className="text-lg text-gray-900">#{product?.id}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Nome do Produto
                </dt>
                <dd className="text-lg text-gray-900">{product?.name}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Marca
                </dt>
                <dd className="text-lg text-gray-900 capitalize">
                  {product?.brand}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Categoria
                </dt>
                <dd>
                  <span className="text-lg font-bold text-gray-900 capitalize">
                    {product?.category}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Preço
                </dt>
                <dd className="text-lg font-bold text-gray-900">
                  {formatPrice(product?.price)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Estoque
                </dt>
                <dd className="flex flex-col">
                  <span className="text-lg font-medium text-gray-900">
                    {product?.stock || 0} unidades
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color} mt-1 w-fit`}
                  >
                    {stockStatus.text}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Data de Cadastro
                </dt>
                <dd className="text-lg text-gray-900">
                  {product?.createdAt
                    ? new Date(product.createdAt).toLocaleDateString("pt-BR")
                    : "Não disponível"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">
                  Última Atualização
                </dt>
                <dd className="text-lg text-gray-900">
                  {product?.updatedAt
                    ? new Date(product.updatedAt).toLocaleDateString("pt-BR")
                    : "Não disponível"}
                </dd>
              </div>
            </dl>

            {product?.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <dt className="text-sm font-medium text-gray-500 mb-2">
                  Descrição
                </dt>
                <dd className="text-sm text-gray-700 leading-6">
                  {product.description}
                </dd>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <Link
                to={`/admin/products/${product?.id}/edit`}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-130 active:brightness-95 text-white border border-amber-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Editar Produto
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
