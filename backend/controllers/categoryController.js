import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

// @desc    Get all categories (grouped by Salon Care / Daily Care)
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ group: 1, displayOrder: 1 });
  res.status(200).json({ success: true, count: categories.length, categories });
});

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.status(200).json({ success: true, category });
});

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, group, description, displayOrder } = req.body;
  const icon = req.file ? req.file.path : undefined;

  const category = await Category.create({ name, group, description, displayOrder, icon });
  res.status(201).json({ success: true, category });
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const { name, group, description, displayOrder, isActive } = req.body;
  if (name) category.name = name;
  if (group) category.group = group;
  if (description !== undefined) category.description = description;
  if (displayOrder !== undefined) category.displayOrder = displayOrder;
  if (isActive !== undefined) category.isActive = isActive;
  if (req.file) category.icon = req.file.path;

  await category.save();
  res.status(200).json({ success: true, category });
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.exists({ category: req.params.id });
  if (inUse) {
    res.status(400);
    throw new Error("Cannot delete a category that has products assigned to it");
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.status(200).json({ success: true, message: "Category deleted" });
});