// Run with: npm run seed        (populate)
//           npm run seed:destroy (wipe)
//
// NOTE: This seeder creates category/product records referencing image
// paths like /uploads/sample/vitamin-c-serum.jpg. It does NOT include any
// actual image files (per project requirement: no placeholder/online images).
// Drop your real product photos into backend/uploads/sample/ using these
// exact filenames, or edit the paths below to match your own assets before
// or after seeding via the admin panel's image upload.

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();
await connectDB();

const destroy = process.argv.includes("-d");

const run = async () => {
  if (destroy) {
    await Promise.all([User.deleteMany({ role: "admin" }), Category.deleteMany(), Product.deleteMany()]);
    console.log("Destroyed categories, products, and admin users.");
    process.exit(0);
  }

  // Admin user
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await User.create({
      name: "GlowAura Admin",
      email: process.env.ADMIN_EMAIL || "admin@glowaura.com",
      password: process.env.ADMIN_PASSWORD || "Admin@12345",
      role: "admin",
    });
    console.log(`Admin created: ${process.env.ADMIN_EMAIL}`);
  }

  // Categories (matching the reference design: Salon Care / Daily Care)
  const categoryDefs = [
    { name: "Soothing Lotion", group: "Salon Care" },
    { name: "Cleansing Milk", group: "Salon Care" },
    { name: "24K Gold Kit", group: "Salon Care" },
    { name: "Vitamin C Kit", group: "Salon Care" },
    { name: "Whitening Facial Kit", group: "Salon Care" },
    { name: "Urgent Facial Kit", group: "Salon Care" },
    { name: "Mani & Pedicure Kit", group: "Salon Care" },
    { name: "Cleansers", group: "Daily Care" },
    { name: "Facewash", group: "Daily Care" },
    { name: "Serums", group: "Daily Care" },
    { name: "Scrubs", group: "Daily Care" },
    { name: "Masks", group: "Daily Care" },
    { name: "Bleach", group: "Daily Care" },
    { name: "Skin Polish", group: "Daily Care" },
  ];

  const categories = {};
  for (const def of categoryDefs) {
    let cat = await Category.findOne({ name: def.name });
    if (!cat) cat = await Category.create(def);
    categories[def.name] = cat;
  }
  console.log(`Seeded ${categoryDefs.length} categories.`);

  // Sample products under "Serums" to match the reference PDP screens
  const serums = categories["Serums"];
  const productDefs = [
    {
      name: "Vitamin C Serum",
      tagline: "Brightening & Anti-Aging",
      description:
        "A potent Vitamin C formula that brightens skin, fades dark spots, and boosts natural glow with daily use.",
      howToUse: "Apply 3-4 drops to clean, dry skin morning and night before moisturizer.",
      ingredients: "Vitamin C (L-Ascorbic Acid), Hyaluronic Acid, Vitamin E, Ferulic Acid",
      images: ["/uploads/sample/vitamin-c-serum.jpg"],
      price: 2299,
      compareAtPrice: 2999,
      variants: [
        { label: "30ml", priceModifier: 0, stock: 40 },
        { label: "50ml", priceModifier: 700, stock: 25 },
      ],
      stock: 65,
      badge: "BEST SELLER",
      concerns: ["Dark Spots", "Anti-Aging", "Brightening"],
      skinType: ["All"],
      isFeatured: true,
      category: serums._id,
    },
    {
      name: "Niacinamide Serum",
      tagline: "Clear & Even Skin Tone",
      description: "10% Niacinamide formula that minimizes pores, controls oil, and evens out skin tone over time.",
      howToUse: "Apply a few drops to clean skin, morning and evening.",
      ingredients: "Niacinamide 10%, Zinc PCA",
      images: ["/uploads/sample/niacinamide-serum.jpg"],
      price: 2199,
      compareAtPrice: 2799,
      variants: [{ label: "30ml", priceModifier: 0, stock: 50 }],
      stock: 50,
      concerns: ["Acne", "Brightening"],
      skinType: ["Oily", "Combination"],
      isFeatured: true,
      category: serums._id,
    },
    {
      name: "Hyaluronic Acid Serum",
      tagline: "Hydration & Plump Skin",
      description: "Multi-molecular weight Hyaluronic Acid that deeply hydrates and plumps skin for a dewy finish.",
      howToUse: "Apply to damp skin, morning and night, then seal with moisturizer.",
      ingredients: "Hyaluronic Acid, Panthenol, Glycerin",
      images: ["/uploads/sample/hyaluronic-acid-serum.jpg"],
      price: 2299,
      compareAtPrice: 2999,
      variants: [{ label: "30ml", priceModifier: 0, stock: 35 }],
      stock: 35,
      concerns: ["Hydration"],
      skinType: ["Dry", "Sensitive"],
      isFeatured: true,
      category: serums._id,
    },
    {
      name: "Retinol Serum",
      tagline: "Anti-Aging & Skin Renewal",
      description: "Gentle encapsulated retinol that smooths fine lines and improves skin texture over time.",
      howToUse: "Apply a pea-sized amount at night only, followed by moisturizer.",
      ingredients: "Encapsulated Retinol 0.5%, Squalane",
      images: ["/uploads/sample/retinol-serum.jpg"],
      price: 2499,
      compareAtPrice: 3099,
      variants: [{ label: "30ml", priceModifier: 0, stock: 20 }],
      stock: 20,
      concerns: ["Anti-Aging"],
      skinType: ["All"],
      category: serums._id,
    },
    {
      name: "Tea Tree Serum",
      tagline: "Acne & Oil Control",
      description: "A lightweight blend that calms breakouts and controls excess oil without over-drying.",
      howToUse: "Dab onto blemish-prone areas or apply all over after cleansing.",
      ingredients: "Tea Tree Oil, Salicylic Acid, Centella Asiatica",
      images: ["/uploads/sample/tea-tree-serum.jpg"],
      price: 1799,
      compareAtPrice: 2499,
      variants: [{ label: "30ml", priceModifier: 0, stock: 54 }],
      stock: 54,
      concerns: ["Acne"],
      skinType: ["Oily"],
      category: serums._id,
    },
    {
      name: "Gold Glow Serum",
      tagline: "Radiance & Brightening",
      description: "A luxurious 24K gold-infused serum that restores radiance and evens skin tone.",
      howToUse: "Apply a few drops and gently massage into skin morning and night.",
      ingredients: "24K Gold Extract, Niacinamide, Vitamin E",
      images: ["/uploads/sample/gold-glow-serum.jpg"],
      price: 2999,
      compareAtPrice: 3499,
      variants: [{ label: "30ml", priceModifier: 0, stock: 42 }],
      stock: 42,
      concerns: ["Brightening"],
      skinType: ["All"],
      category: serums._id,
    },
  ];

  for (const def of productDefs) {
    const exists = await Product.findOne({ name: def.name });
    if (!exists) await Product.create(def);
  }
  console.log(`Seeded ${productDefs.length} sample products under "Serums".`);
  console.log("Done. Remember to add real product images (see note at top of this file).");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
