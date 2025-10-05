import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";

import { useAuth } from "../components/authContext";
import apiService from "../components/apiService";

export const ProductExpanded = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState(new Set());

  useEffect(() => {
    if (!product && id) {
      fetchProduct();
    }
  }, [id, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProduct(id);
      setProduct(response);
    } catch (error) {
      setError("Erro ao carregar produto");
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (cartItems.has(productId)) return;

    try {
      setCartItems((prev) => new Set([...prev, productId]));
      await apiService.addToCart(productId, user.id, 1);
    } catch (err) {
      setCartItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      alert("Erro ao adicionar produto ao carrinho!");
      console.error(err);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "R$ 0,00";
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Carregando produto...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Produto não encontrado"}
          </div>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = (product.stock || 0) === 0;
  const isInCart = cartItems.has(product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={handleBack}
          className="bg-gradient-to-r from-gray-600 to-slate-500 cursor-pointer hover:brightness-130 active:brightness-95 text-white border border-stone-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          ← Voltar
        </button>

        <div className="bg-white mt-4 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/500x500/cccccc/666666?text=IMG";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg
                    className="w-24 h-24 text-gray-400"
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

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-stone-500 text-stone-100 rounded-lg text-sm font-medium capitalize">
                    {product.category}
                  </span>
                  <span className="text-lg text-gray-600 capitalize font-medium">
                    {product.brand}
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <span className="text-4xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Descrição
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description ||
                    "Descrição não disponível para este produto."}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Disponibilidade
                </h3>
                <p
                  className={`font-medium ${
                    isOutOfStock ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isOutOfStock
                    ? "Produto indisponível"
                    : `${product.stock} unidades em estoque`}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={isOutOfStock || isInCart}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-xl transition-all duration-300 ${
                    isOutOfStock
                      ? "bg-gradient-to-br from-zinc-300 to-neutral-500 text-stone-900 border border-lime-600 cursor-not-allowed"
                      : isInCart
                      ? "bg-gradient-to-br from-green-400 to-lime-400 text-stone-900 border border-amber-600 cursor-not-allowed"
                      : "bg-gradient-to-br from-yellow-200 to-amber-400 text-stone-900 border border-amber-600 shadow-md hover:shadow-lg hover:brightness-110 active:brightness-95 cursor-pointer"
                  }`}
                >
                  {isOutOfStock
                    ? "Produto Indisponível"
                    : isInCart
                    ? "✓ Adicionado ao Carrinho"
                    : "Adicionar ao Carrinho"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
