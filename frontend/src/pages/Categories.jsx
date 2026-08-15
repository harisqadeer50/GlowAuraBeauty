import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { categoryApi } from "../api/productApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ScrollReveal from "../components/common/ScrollReveal";
import { FiChevronRight } from "react-icons/fi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const activeGroup = searchParams.get("group");

  useEffect(() => {
    categoryApi
      .getAll()
      .then((res) => setCategories(res.categories))
      .finally(() => setLoading(false));
  }, []);

  const groups = ["Salon Care", "Daily Care"].filter((g) => !activeGroup || g === activeGroup);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <p className="text-xs text-brown/60 mb-2">
        <Link to="/" className="hover:text-gold-dark">Home</Link> / Categories
      </p>
      <h1 className="font-display text-4xl text-charcoal mb-1">
        Our <span className="text-gold-dark italic">Categories</span>
      </h1>
      <p className="text-brown mb-10">Discover our complete range of premium skincare</p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={`grid gap-8 ${groups.length > 1 ? "md:grid-cols-2" : ""}`}>
          {groups.map((group) => (
            <ScrollReveal key={group} className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl text-charcoal mb-4">{group.toUpperCase()}</h2>
              <ul>
                {categories
                  .filter((c) => c.group === group)
                  .map((cat) => (
                    <li key={cat._id}>
                      <Link
                        to={`/shop?category=${cat.slug}`}
                        className="flex items-center justify-between py-3 border-b border-beige last:border-0 group"
                      >
                        <span className="flex items-center gap-3">
                          {cat.icon && (
                            <img
                              src={cat.icon}
                              alt={cat.name}
                              className="w-10 h-10 object-contain shrink-0"
                            />
                          )}
                          <span className="text-sm text-charcoal group-hover:text-gold-dark transition-colors">
                            {cat.name}
                          </span>
                        </span>
                        <FiChevronRight className="text-brown/40 group-hover:text-gold-dark transition-colors shrink-0" />
                      </Link>
                    </li>
                  ))}
                {categories.filter((c) => c.group === group).length === 0 && (
                  <p className="text-sm text-brown/50 py-3">No categories yet in this group.</p>
                )}
              </ul>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
