import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

// @desc    Dashboard summary metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalCustomers, totalOrders, orders, lowStock] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.countDocuments(),
    Order.find({ status: { $ne: "Cancelled" } }).select("totalPrice status createdAt"),
    Product.find({ stock: { $lte: 10 }, isActive: true }).select("name stock").limit(5),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const statusBreakdown = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Last 7 days revenue trend
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentOrders = orders.filter((o) => o.createdAt >= sevenDaysAgo);
  const dailyRevenue = {};
  recentOrders.forEach((o) => {
    const day = o.createdAt.toISOString().slice(0, 10);
    dailyRevenue[day] = (dailyRevenue[day] || 0) + o.totalPrice;
  });

  res.status(200).json({
    success: true,
    stats: {
      totalProducts,
      totalCustomers,
      totalOrders,
      revenue,
      statusBreakdown,
      dailyRevenue,
      lowStockProducts: lowStock,
    },
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Update a user's role or active status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;
  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ success: true, message: "User deleted" });
});
