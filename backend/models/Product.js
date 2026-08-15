import mongoose from "mongoose";
import slugify from "slugify";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "30ml"
    priceModifier: { type: Number, default: 0 }, // added to base price
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    slug: { type: String, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    tagline: { type: String, trim: true }, // e.g. "Brightening & Anti-Aging"
    description: { type: String, required: true },
    howToUse: { type: String },
    ingredients: { type: String },
    images: [{ type: String, required: true }], // paths to /uploads
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 }, // original/strikethrough price
    variants: [variantSchema],
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, unique: true, sparse: true },
    badge: { type: String, enum: ["", "BEST SELLER", "SALE", "NEW"], default: "" },
    concerns: [{ type: String }], // Acne, Dark Spots, Anti-Aging, Brightening, Hydration
    skinType: [{ type: String }], // All, Dry, Oily, Sensitive, Combination
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (this.isNew || this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + "-" + Math.random().toString(36).slice(2, 7);
  }
  next();
});

productSchema.methods.recalculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
    return;
  }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating = Math.round((total / this.reviews.length) * 10) / 10;
  this.numReviews = this.reviews.length;
};

productSchema.index({ name: "text", tagline: "text", description: "text" });

export default mongoose.model("Product", productSchema);
