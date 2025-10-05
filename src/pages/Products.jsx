import { useState, useEffect } from "react";
import { Link } from "react-router";
import { AdminNavbar } from "../components/AdminNavbar";
import apiService from "../components/apiService";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      setProducts(response);
    } catch (error) {
      setError("Erro ao carregar produtos");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o produto "${productName}"?`
      )
    ) {
      try {
        await apiService.deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
        alert("Produto excluído com sucesso!");
      } catch (error) {
        alert("Erro ao excluir produto");
        console.error("Error deleting product:", error);
      }
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
          <div className="text-lg text-gray-600">Carregando produtos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
                PRODUTOS
              </h1>
            </div>

            <Link
              to="/admin/products/create"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110 active:brightness-95 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar Produto
            </Link>
          </div>
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
                  <th className="px-6 py-4 text-left text-lg font-medium text-yellow-400 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-medium text-yellow-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-medium text-yellow-400 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-4 text-left text-lg font-medium text-yellow-400 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-medium text-yellow-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.stock);

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-25  max-h-25 bg-gray-200 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
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
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: #{product.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900 capitalize">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {product.stock || 0} unidades
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color} mt-1 w-fit`}
                          >
                            {stockStatus.text}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <Link
                            to={`/admin/products/${product.id}/details`}
                            className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-2 rounded-full transition-colors duration-200"
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
                            to={`/admin/products/${product.id}/edit`}
                            className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 p-2 rounded-full transition-colors duration-200"
                            title="Editar produto"
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
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            className="bg-red-100 text-red-600 hover:bg-red-200 p-2 cursor-pointer rounded-full transition-colors duration-200"
                            title="Excluir produto"
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {products.length === 0 && !loading && (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum produto encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece adicionando seu primeiro produto ao catálogo.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/products/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Adicionar Produto
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
