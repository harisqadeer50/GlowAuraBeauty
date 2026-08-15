import api from "./axios";

export const authApi = {
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  updateProfile: (data) => api.put("/auth/profile", data).then((r) => r.data),
  addAddress: (data) => api.post("/auth/addresses", data).then((r) => r.data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`).then((r) => r.data),
  getWishlist: () => api.get("/auth/wishlist").then((r) => r.data),
  toggleWishlist: (productId) => api.post(`/auth/wishlist/${productId}`).then((r) => r.data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }).then((r) => r.data),
};