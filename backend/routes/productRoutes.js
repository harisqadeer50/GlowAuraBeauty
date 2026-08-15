import express from "express";
import {
  getProducts,
  getFeaturedProducts,
  getFeaturedReviews,
  getProductBySlug,
  addProductReview,
  deleteProductReview,
} from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/reviews/featured", getFeaturedReviews);
router.get("/:slug", getProductBySlug);
router.post("/:id/reviews", protect, addProductReview);
router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);

export default router;
