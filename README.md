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

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env      # then edit MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed               # creates admin user + categories + 6 sample products
npm run dev                 # starts on http://localhost:5000
```

Default seeded admin login (override in `.env` before seeding):
- Email: `admin@glowaura.com`
- Password: `Admin@12345`

You'll need a MongoDB instance — either MongoDB Atlas (recommended, put the
connection string in `MONGO_URI`) or a local `mongod` on `mongodb://127.0.0.1:27017`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev    # starts on http://localhost:5173, proxies /api and /uploads to :5000
```

Open `http://localhost:5173`. Log in with the seeded admin account and visit
`/admin` to add real product photos — the project intentionally ships with **no
placeholder or stock images**; the seeder creates product records but you upload
actual photos through the admin panel's image picker (or drop files matching the
paths noted in `backend/utils/seeder.js` into `backend/uploads/sample/`).

## Known scaffold limitations (intentionally left for you to extend)

- **Product variants** (size options like 30ml/50ml) are defined in the data model
  and shown on the storefront, but the admin product form doesn't yet have a UI to
  add/edit them — currently easiest to seed or edit directly in MongoDB, or extend
  `AdminProductForm.jsx` with a repeatable variant row.
- **Admin "edit product"** currently finds the product by re-fetching the public
  list rather than a dedicated `/api/admin/products/:id` GET route — fine at small
  catalog sizes, but worth adding a proper single-product admin endpoint as you scale.
- **Coupons** — the `Order` model has a `couponDiscount` field and checkout summary
  supports it, but there's no coupon-code entry UI or validation endpoint yet.
- **Wishlist** uses a simple toggle; there's no "add to wishlist" button wired into
  the product detail page's heart icon yet (icon is present, handler isn't).
- No automated tests included — given the scope, I'd suggest adding integration
  tests for the order-creation and auth flows first since those touch money/security.

## Tech notes

- Tailwind v4 is used via `@tailwindcss/vite` — theme tokens (colors, fonts) live in
  `frontend/src/index.css` under `@theme`, not a `tailwind.config.js`.
- GSAP is used for: navbar entrance, hero timeline, cart drawer slide-in, and a
  lightweight `ScrollReveal` wrapper (IntersectionObserver + GSAP tween) for
  scroll-triggered section reveals — no ScrollTrigger plugin needed for this scope.
- Cart is persisted in `localStorage` (real app, not a Claude artifact — regular
  browser storage is fine here).
