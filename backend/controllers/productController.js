import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// @desc    Get top-rated recent reviews across all products, for homepage display
// @route   GET /api/products/reviews/featured
// @access  Public
export const getFeaturedReviews = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const reviews = await Product.aggregate([
    { $match: { isActive: true, "reviews.0": { $exists: true } } },
    { $unwind: "$reviews" },
    { $match: { "reviews.rating": { $gte: 4 } } },
    { $sort: { "reviews.rating": -1, "reviews.createdAt": -1 } },
    { $limit: Number(limit) },
    {
      $project: {
        _id: 0,
        reviewId: "$reviews._id",
        reviewerName: "$reviews.name",
        rating: "$reviews.rating",
        comment: "$reviews.comment",
        createdAt: "$reviews.createdAt",
        productName: "$name",
        productSlug: "$slug",
      },
    },
  ]);

  res.status(200).json({ success: true, reviews });
});

// @desc    Get products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    skinType,
    concern,
    sort = "popularity",
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$text = { $search: keyword };
  }

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.category = cat._id;
    else return res.status(200).json({ success: true, count: 0, page: 1, pages: 0, products: [] });
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (skinType) {
    query.skinType = { $in: Array.isArray(skinType) ? skinType : [skinType] };
  }

  if (concern) {
    query.concerns = { $in: Array.isArray(concern) ? concern : [concern] };
  }

  const sortMap = {
    popularity: { soldCount: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1 },
  };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [products, count] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort(sortMap[sort] || sortMap.popularity)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count,
    page: pageNum,
    pages: Math.ceil(count / limitNum),
    products,
  });
});

// @desc    Get featured / best-seller products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate("category", "name slug")
    .sort({ soldCount: -1 })
    .limit(8);
  res.status(200).json({ success: true, products });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate("category", "name slug")
    .populate("reviews.user", "name");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const images = (req.files || []).map((f) => f.path);
  if (images.length === 0) {
    res.status(400);
    throw new Error("At least one product image is required");
  }

  let { variants, concerns, skinType } = req.body;
  if (typeof variants === "string") variants = JSON.parse(variants);
  if (typeof concerns === "string") concerns = JSON.parse(concerns);
  if (typeof skinType === "string") skinType = JSON.parse(skinType);

  const product = await Product.create({
    ...req.body,
    variants,
    concerns,
    skinType,
    images,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updatable = [
    "name", "category", "tagline", "description", "howToUse", "ingredients",
    "price", "compareAtPrice", "stock", "sku", "badge", "isFeatured", "isActive",
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  ["variants", "concerns", "skinType"].forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = typeof req.body[field] === "string" ? JSON.parse(req.body[field]) : req.body[field];
    }
  });

  if (req.files && req.files.length > 0) {
    product.images = req.files.map((f) => f.path);
  }

  await product.save();
  res.status(200).json({ success: true, product });
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true, message: "Product deleted" });
});

// @desc    Add a product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.recalculateRating();
  await product.save();

  res.status(201).json({ success: true, message: "Review added" });
});

// @desc    Delete a product review (the review's author, or an admin)
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
export const deleteProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const review = product.reviews.id(req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  const isOwner = review.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  product.reviews = product.reviews.filter((r) => r._id.toString() !== req.params.reviewId);
  product.recalculateRating();
  await product.save();

  res.status(200).json({ success: true, message: "Review deleted" });
});