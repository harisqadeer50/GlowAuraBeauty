import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productApi } from "../../api/productApi";
import StarRating from "../common/StarRating";
import ScrollReveal from "../common/ScrollReveal";

const ReviewCard = ({ r }) => (
  <div className="w-72 sm:w-80 shrink-0 bg-white rounded-2xl shadow-card p-6 mx-3">
    <StarRating rating={r.rating} />
    <p className="text-sm text-brown mt-4 leading-relaxed line-clamp-4">"{r.comment}"</p>
    <div className="flex items-center gap-3 mt-5">
      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold-dark font-display text-sm shrink-0">
        {r.reviewerName.charAt(0)}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-charcoal truncate">{r.reviewerName}</p>
        <p className="text-xs text-brown/60">Customer Review</p>
      </div>
    </div>
    <Link to={`/product/${r.productSlug}`} className="inline-block text-xs text-gold-dark hover:underline mt-4">
      on {r.productName}
    </Link>
  </div>
);

const OurHappyCustomers = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi
      .getFeaturedReviews(16)
      .then((res) => setReviews(res.reviews))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  // No hardcoded fallback content here on purpose — showing fake
  // testimonials next to real ones (or before any exist) would be
  // misleading. Once customers leave their first 4-5 star reviews on
  // product pages, this section appears on its own.
  if (!loading && reviews.length === 0) return null;

  return (
    <section className="py-16">
      <ScrollReveal className="text-center mb-10 px-4">
        <h2 className="font-display text-3xl text-charcoal">Our Happy Customers</h2>
      </ScrollReveal>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card p-6 animate-pulse h-40" />
          ))}
        </div>
      ) : (
        // Edge-to-edge marquee: the list is duplicated once so the CSS
        // animation can scroll exactly -50% and loop with no visible seam.
        // Paused on hover/focus so people can actually read a card.
        <div
          className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        >
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
            {[...reviews, ...reviews].map((r, i) => (
              <ReviewCard key={`${r.reviewId}-${i}`} r={r} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default OurHappyCustomers;
