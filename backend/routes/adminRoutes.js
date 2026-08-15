import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

import { createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { getDashboardStats, getUsers, updateUser, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

// Everything below requires a logged-in admin
router.use(protect, authorize("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Products
router.post("/products", upload.array("images", 6), createProduct);
router.put("/products/:id", upload.array("images", 6), updateProduct);
router.delete("/products/:id", deleteProduct);

// Categories
router.post("/categories", upload.single("icon"), createCategory);
router.put("/categories/:id", upload.single("icon"), updateCategory);
router.delete("/categories/:id", deleteCategory);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// Users
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
