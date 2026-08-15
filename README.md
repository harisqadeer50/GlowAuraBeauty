# GlowAura Beauty — MERN E-Commerce

A full-stack luxury skincare storefront: React 19 + Tailwind v4 + GSAP on the frontend,
Express + MongoDB (Mongoose) + JWT auth on the backend. Cash on Delivery only, matching
the reference design (cream/beige/gold palette, Playfair Display + Poppins).

## What's built

**Storefront**
- Home (hero, shop-by-category, best sellers, promo banner, trust badges, testimonials)
- Category browsing (Salon Care / Daily Care groups)
- Shop page: search, category/price/skin-type/concern filters, sort, pagination
- Product detail: image gallery, variants, quantity, accordion tabs, reviews
- Cart (drawer + full page), Checkout (COD), order confirmation
- Auth: register/login (JWT), profile, saved addresses, order history/tracking, wishlist

**Admin panel** (`/admin`, requires an admin account)
- Dashboard: totals (products/orders/customers/revenue), status breakdown, low-stock alert
- Products: list, search, create/edit (multi-image upload), delete
- Categories: create/edit/delete, grouped by Salon Care / Daily Care
- Orders: list, filter by status, update status (Pending → Processing → Shipped → Delivered/Cancelled)
- Users: list, promote/demote admin, enable/disable, delete

**Backend**
- REST API under `/api`, JWT auth (httpOnly cookie + bearer token), bcrypt password hashing
- Role-based middleware (`protect`, `authorize("admin")`)
- Multer image uploads served from `/uploads`
- Centralized error handling, request validation, basic rate limiting on auth routes
- Order creation re-validates price/stock server-side (never trusts client-submitted totals)

## Project structure

```
glowaura/
├── backend/          Express API
│   ├── config/        MongoDB connection
│   ├── controllers/   Route handlers
│   ├── middleware/     auth, admin guard, upload, error handler, validation
│   ├── models/         User, Category, Product, Order
│   ├── routes/         auth, products, categories, orders, admin
│   ├── uploads/        uploaded images (served statically)
│   ├── utils/seeder.js Seeds admin user, categories, sample products
│   └── server.js
└── frontend/          React (Vite) app
    ├── src/api/         axios instance + service modules
    ├── src/components/  layout, product, cart, home, common
    ├── src/context/     AuthContext, CartContext
    ├── src/pages/        storefront pages
    └── src/pages/admin/  admin panel pages
```





