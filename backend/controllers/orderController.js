import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const FLAT_SHIPPING_FEE = 200; // PKR, matches design's checkout summary

// @desc    Create new order (COD only)
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingInfo, couponDiscount = 0 } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  // Re-validate prices & stock from DB rather than trusting the client
  let itemsPrice = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product ${item.name || item.product} is no longer available`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    let unitPrice = product.price;
    if (item.variant) {
      const variant = product.variants.find((v) => v.label === item.variant);
      if (variant) unitPrice += variant.priceModifier;
    }

    itemsPrice += unitPrice * item.quantity;
    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      variant: item.variant,
      price: unitPrice,
      quantity: item.quantity,
    });

    product.stock -= item.quantity;
    product.soldCount += item.quantity;
    await product.save();
  }

  const shippingPrice = itemsPrice > 5000 ? 0 : FLAT_SHIPPING_FEE;
  const totalPrice = itemsPrice + shippingPrice - couponDiscount;

  const order = await Order.create({
    user: req.user._id,
    items: verifiedItems,
    shippingInfo,
    itemsPrice,
    shippingPrice,
    couponDiscount,
    totalPrice,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get single order (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }
  res.status(200).json({ success: true, order });
});

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  const [orders, count] = await Promise.all([
    Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  res.status(200).json({ success: true, count, page: pageNum, pages: Math.ceil(count / limitNum), orders });
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  order.statusHistory.push({ status, note });

  if (status === "Delivered") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  if (status === "Cancelled") {
    // restock items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, soldCount: -item.quantity } });
    }
  }

  await order.save();
  res.status(200).json({ success: true, order });
});
