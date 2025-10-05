import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../components/authContext";
import apiService from "../components/apiService";

export const Cart = () => {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchaseSuccess, setPurchaseSuccess] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getMyCart();

      console.log("🔍 API Response:", response);

      let items = [];
      if (Array.isArray(response)) {
        items = response;
      } else if (response && Array.isArray(response.items)) {
        items = response.items;
      } else if (response && response.data && Array.isArray(response.data)) {
        items = response.data;
      }

      setCartItems(items);
    } catch (err) {
      setError("Erro ao carregar o carrinho");
      console.error("Erro fetchCart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = async (item) => {
    if (item.quantity >= item.product.stock) return;

    try {
      const newQuantity = item.quantity + 1;
      await apiService.updateCartItem(item.id, newQuantity);

      setCartItems((prev) =>
        prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: newQuantity } : ci
        )
      );
    } catch (err) {
      alert("Erro ao atualizar quantidade");
      console.error(err);
    }
  };

  const decrementQuantity = async (item) => {
    if (item.quantity <= 1) return;

    try {
      const newQuantity = item.quantity - 1;
      await apiService.updateCartItem(item.id, newQuantity);

      setCartItems((prev) =>
        prev.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: newQuantity } : ci
        )
      );
    } catch (err) {
      alert("Erro ao atualizar quantidade");
      console.error(err);
    }
  };

  const removeItem = async (itemId, productName) => {
    if (!window.confirm(`Remover "${productName}" do carrinho?`)) return;

    try {
      await apiService.removeFromCart(itemId);
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      alert("Erro ao remover item");
      console.error(err);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Tem certeza que deseja esvaziar o carrinho?")) return;

    try {
      await apiService.clearCart();
      setCartItems([]);
    } catch (err) {
      alert("Erro ao esvaziar carrinho");
      console.error(err);
    }
  };

  const finalizePurchase = async () => {
    if (!window.confirm("Finalizar compra?")) return;

    try {
      setPurchasing(true);
      await apiService.checkoutCart();

      setPurchaseSuccess("🎉 Compra concluída com sucesso!");
      setCartItems([]);

      setTimeout(() => setPurchaseSuccess(""), 5000);
    } catch (err) {
      alert("Erro ao finalizar compra");
      console.error(err);
    } finally {
      setPurchasing(false);
    }
  };

  const calculateTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Carregando carrinho...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-2">
                CARRINHO
              </h1>
              <p className="text-gray-600">
                {!Array.isArray(cartItems) || cartItems.length === 0
                  ? "Seu carrinho está vazio"
                  : `${cartItems.length} item(s) no carrinho`}
              </p>
            </div>

            {Array.isArray(cartItems) && cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="bg-gradient-to-r from-red-500 to-red-600 cursor-pointer hover:brightness-110 active:brightness-95 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Esvaziar
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {purchaseSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
            <strong>{purchaseSuccess}</strong>
          </div>
        )}

        {!Array.isArray(cartItems) || cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Carrinho vazio
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece adicionando produtos ao seu carrinho.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-amber-50 rounded-lg border border-amber-600 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  {/* Imagem do Produto */}
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x300/cccccc/666666?text=IMG";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg
                          className="w-16 h-16 text-gray-400"
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

                  {/* Conteúdo do Card */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-stone-500 text-stone-100 rounded-lg capitalize">
                        {item.product.category}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {item.product.brand}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(item.product.price)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Estoque: {item.product.stock} unidades
                      </p>
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="flex items-center justify-between mb-3 bg-white rounded-lg p-2">
                      <button
                        onClick={() => decrementQuantity(item)}
                        disabled={item.quantity <= 1}
                        className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center font-bold text-lg transition-colors duration-200 ${
                          item.quantity <= 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        −
                      </button>

                      <span className="text-lg font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => incrementQuantity(item)}
                        disabled={item.quantity >= item.product.stock}
                        className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center font-bold text-lg transition-colors duration-200 ${
                          item.quantity >= item.product.stock
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal e Remover */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Subtotal</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id, item.product.name)}
                        className="bg-red-100 cursor-pointer hover:bg-red-200 text-red-600 p-2 rounded-full transition-colors duration-200"
                        title="Remover produto"
                      >
                        <svg
                          className="w-5 h-5"
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
                  </div>
                </div>
              ))}
            </div>

            {/* Total e Botão de Finalizar */}
            <div className="bg-amber-50 rounded-lg border border-amber-600 shadow-md p-6 mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left w-full sm:w-auto">
                  <p className="text-sm text-gray-600">Total da compra:</p>
                  <p className="text-3xl sm:text-4xl font-bold text-green-600">
                    {formatPrice(calculateTotal())}
                  </p>
                </div>

                <button
                  onClick={finalizePurchase}
                  disabled={purchasing || cartItems.length === 0}
                  className="w-full sm:w-auto bg-gradient-to-br from-yellow-200 to-amber-400 cursor-pointer font-semibold text-stone-900 px-8 py-3 rounded shadow-md border border-amber-600 transition-all duration-300 hover:shadow-lg hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl"
                >
                  {purchasing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                      Processando...
                    </>
                  ) : (
                    <>Finalizar Compra</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
