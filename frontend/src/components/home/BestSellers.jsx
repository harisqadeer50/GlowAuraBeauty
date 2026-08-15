import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import ProductCard from "../product/ProductCard";
import ScrollReveal from "../common/ScrollReveal";
import LoadingSpinner from "../common/LoadingSpinner";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    productApi
      .getFeatured()
      .then((res) => setProducts(res.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <ScrollReveal className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl text-charcoal">Best Sellers</h2>
        <Link to="/shop?sort=popularity" className="text-sm font-medium text-gold-dark hover:underline">
          VIEW ALL
        </Link>
      </ScrollReveal>

      {loading && <LoadingSpinner />}
      {error && <p className="text-center text-red-500 text-sm py-8">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-brown/60 text-sm py-8">
          No products yet — add some from the admin panel to see them here.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <div
          className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6
                     overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none
                     -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0
                     [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]"
        >
          {products.map((p, i) => (
            <ScrollReveal
              key={p._id}
              delay={i * 0.05}
              className="w-[68vw] xs:w-[60vw] sm:w-auto flex-shrink-0 snap-start"
            >
              <ProductCard product={p} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
};

export default BestSellers;