const API_BASE_URL =
  "https://deathstore-backendproject-production.up.railway.app" ||
  "http://localhost:3000";

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (token && !options.noAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.message ||
            errorData.error ||
            `Erro HTTP: ${response.status}`;
        } catch {
          errorMessage =
            (await response.text()) || `Erro HTTP: ${response.status}`;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.response = {
          data: { message: errorMessage },
          status: response.status,
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      noAuth: true,
    });
  }

  async signup(userData) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
      noAuth: true,
    });
  }

  async getUsers() {
    return this.request("/user");
  }

  async findOne(id) {
    return this.request(`/user/${id}`);
  }

  async getMe() {
    return this.request("/user/me");
  }

  async createUser(userData) {
    return this.request("/user", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/user/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/user/${id}`, {
      method: "DELETE",
    });
  }

  async getProducts() {
    return this.request("/products");
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async addToCart(productId, userId, quantity = 1) {
    return this.request("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async getMyCart() {
    return this.request("/cart");
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
  }

  async clearCart() {
    return this.request("/cart", {
      method: "DELETE",
    });
  }

  async checkoutCart() {
    return this.request("/cart/checkout", {
      method: "POST",
    });
  }
}

export default new ApiService();
