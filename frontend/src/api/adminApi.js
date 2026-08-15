import api from "./axios";

export const adminApi = {
  // Dashboard
  getDashboard: () => api.get("/admin/dashboard").then((r) => r.data),

  // Products (multipart for image uploads)
  createProduct: (formData) =>
    api.post("/admin/products", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  updateProduct: (id, formData) =>
    api.put(`/admin/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`).then((r) => r.data),

  // Categories
  createCategory: (formData) =>
    api.post("/admin/categories", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  updateCategory: (id, formData) =>
    api.put(`/admin/categories/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`).then((r) => r.data),

  // Orders
  getOrders: (params) => api.get("/admin/orders", { params }).then((r) => r.data),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data).then((r) => r.data),

  // Users
  getUsers: () => api.get("/admin/users").then((r) => r.data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
};
