import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { AdminNavbar } from "../components/AdminNavbar";
import { useAuth } from "../components/authContext";
import apiService from "../components/apiService";

export const Home = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("default");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [cartItems, setCartItems] = useState(new Set());

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy, selectedBrand, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      setProducts(response);

      const uniqueBrands = [...new Set(response.map((p) => p.brand))].sort();
      const uniqueCategories = [
        ...new Set(response.map((p) => p.category)),
      ].sort();
      setBrands(uniqueBrands);
      setCategories(uniqueCategories);
    } catch (error) {
      setError("Erro ao carregar produtos");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        filtered.sort((a, b) => {
          if ((a.stock || 0) > 0 && (b.stock || 0) === 0) return -1;
          if ((a.stock || 0) === 0 && (b.stock || 0) > 0) return 1;
          return a.id - b.id;
        });
    }

    if (sortBy !== "default") {
      filtered.sort((a, b) => {
        const aHasStock = (a.stock || 0) > 0;
        const bHasStock = (b.stock || 0) > 0;
        if (aHasStock && !bHasStock) return -1;
        if (!aHasStock && bHasStock) return 1;
        return 0;
      });
    }

    setFilteredProducts(filtered);
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

  const clearFilters = () => {
    setSortBy("default");
    setSelectedBrand("");
    setSelectedCategory("");
    setSearchParams({});
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {user?.isAdmin ? <AdminNavbar /> : <Navbar />}
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">Carregando produtos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.isAdmin ? <AdminNavbar /> : <Navbar />}

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ordenar por:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="default">Padrão</option>
                <option value="price-asc">Preço Crescente</option>
                <option value="price-desc">Preço Decrescente</option>
                <option value="name-asc">Nome de A a Z</option>
                <option value="name-desc">Nome de Z a A</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filtrar por Marca:
              </label>
              <select
                id="brand"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Todas as marcas</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand} className="capitalize">
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filtrar por Categoria:
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category === "armas"}
                    {category === "naves"}
                    {category === "robos"}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isOutOfStock = (product.stock || 0) === 0;
            const isInCart = cartItems.has(product.id);

            return (
              <div
                key={product.id}
                className={`bg-amber-50 rounded-lg border border-amber-600 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer ${
                  isOutOfStock ? "opacity-75" : ""
                }`}
                onClick={() => handleProductClick(product)}
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-stone-500 text-stone-100 rounded-lg capitalize">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {product.brand}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    disabled={isOutOfStock || isInCart}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                      isOutOfStock
                        ? "bg-gradient-to-br from-zinc-300 to-neutral-500 text-xl font-semibold text-stone-900 px-3 py-1 rounded shadow-md border border-lime-600 cursor-not-allowed"
                        : isInCart
                        ? "bg-gradient-to-br from-green-400 to-lime-400 text-xl font-semibold text-stone-900 px-3 py-1 rounded shadow-md border border-amber-600 cursor-not-allowed"
                        : "bg-gradient-to-br from-yellow-200 to-amber-400 text-xl cursor-pointer font-semibold text-stone-900 px-3 py-1 rounded shadow-md border border-amber-600 transition-all duration-300 hover:shadow-lg hover:brightness-190 active:brightness-95"
                    }`}
                  >
                    {isOutOfStock
                      ? "Indisponível"
                      : isInCart
                      ? "✓ Adicionado"
                      : "Adicionar ao Carrinho"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && !loading && (
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
              Tente ajustar seus filtros ou ordenação para encontrar produtos.
            </p>
            <div className="mt-6">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
