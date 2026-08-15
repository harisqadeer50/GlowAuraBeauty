import api from "./axios";

export const orderApi = {
  create: (data) => api.post("/orders", data).then((r) => r.data),
  getMine: () => api.get("/orders/mine").then((r) => r.data),
  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data),
};
