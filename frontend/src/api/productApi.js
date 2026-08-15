import api from "./axios";

export const productApi = {
  getAll: (params) => api.get("/products", { params }).then((r) => r.data),
  getFeatured: () => api.get("/products/featured").then((r) => r.data),
  getFeaturedReviews: (limit) => api.get("/products/reviews/featured", { params: { limit } }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/products/${slug}`).then((r) => r.data),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data).then((r) => r.data),
  deleteReview: (productId, reviewId) => api.delete(`/products/${productId}/reviews/${reviewId}`).then((r) => r.data),
};

export const categoryApi = {
  getAll: () => api.get("/categories").then((r) => r.data),
  getBySlug: (slug) => api.get(`/categories/${slug}`).then((r) => r.data),
};
