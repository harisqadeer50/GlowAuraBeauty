import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { productApi, categoryApi } from "../api/productApi";
import ProductCard from "../components/product/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { FiFilter, FiX } from "react-icons/fi";

const SKIN_TYPES = ["All", "Dry", "Oily", "Sensitive", "Combination"];
const CONCERNS = ["Acne", "Dark Spots", "Anti-Aging", "Brightening", "Hydration"];
const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "popularity";
  const page = Number(searchParams.get("page") || 1);
  const skinType = searchParams.getAll("skinType");
  const concern = searchParams.getAll("concern");
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.categories));
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    productApi
      .getAll({ keyword, category, sort, page, skinType, concern, minPrice, maxPrice, limit: 12 })
      .then((res) => {
        setProducts(res.products);
        setPages(res.pages);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, category, sort, page, minPrice, maxPrice, JSON.stringify(skinType), JSON.stringify(concern)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const toggleArrayParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const current = next.getAll(key);
    next.delete(key);
    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => next.append(key, v));
    } else {
      [...current, value].forEach((v) => next.append(key, v));
    }
    next.delete("page");
    setSearchParams(next);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-charcoal text-sm mb-3">CATEGORY</h4>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c._id}>
              <button
                onClick={() => updateParam("category", category === c.slug ? "" : c.slug)}
                className={`text-sm flex items-center gap-2 ${category === c.slug ? "text-gold-dark font-medium" : "text-brown"}`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border ${category === c.slug ? "bg-gold border-gold" : "border-brown/30"}`} />
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-medium text-charcoal text-sm mb-3">PRICE</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => updateParam("minPrice", e.target.value)}
            className="w-full border border-beige rounded-lg px-2 py-1.5 text-sm outline-none focus:border-gold"
          />
          <span className="text-brown/40">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParam("maxPrice", e.target.value)}
            className="w-full border border-beige rounded-lg px-2 py-1.5 text-sm outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-charcoal text-sm mb-3">SKIN TYPE</h4>
        <div className="flex flex-wrap gap-2">
          {SKIN_TYPES.map((s) => (
            <button
              key={s}
              onClick={() => toggleArrayParam("skinType", s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                skinType.includes(s) ? "bg-gold text-white border-gold" : "border-beige text-brown hover:border-gold"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-charcoal text-sm mb-3">CONCERN</h4>
        <div className="flex flex-wrap gap-2">
          {CONCERNS.map((c) => (
            <button
              key={c}
              onClick={() => toggleArrayParam("concern", c)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                concern.includes(c) ? "bg-gold text-white border-gold" : "border-beige text-brown hover:border-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <p className="text-xs text-brown/60 mb-2">
        <Link to="/" className="hover:text-gold-dark">Home</Link> / Shop
        {category && ` / ${categories.find((c) => c.slug === category)?.name || category}`}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-charcoal">
          {keyword ? `Results for "${keyword}"` : category ? categories.find((c) => c.slug === category)?.name || "Shop" : "All Products"}
        </h1>
        <div className="flex items-center gap-3">
          <button
            className="md:hidden flex items-center gap-1.5 text-sm border border-beige rounded-full px-3 py-1.5 whitespace-nowrap"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <FiFilter /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="text-sm border border-beige rounded-full px-3 py-1.5 outline-none bg-white flex-1 sm:flex-none min-w-0"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden md:block">
          <FilterPanel />
        </aside>

        <div>
          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <p className="text-center text-brown/60 py-16">No products match your filters.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParam("page", String(i + 1))}
                      className={`w-9 h-9 rounded-full text-sm ${
                        page === i + 1 ? "bg-gold text-white" : "border border-beige text-brown hover:border-gold"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><FiX /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
