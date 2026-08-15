import { useRef } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import gsap from "gsap";
import toast from "react-hot-toast";
import PriceTag from "../common/PriceTag";
import StarRating from "../common/StarRating";
import ProductImage from "../common/ProductImage";
import { useCart } from "../../context/CartContext";

const badgeStyles = {
  "BEST SELLER": "bg-charcoal text-white",
  SALE: "bg-red-600 text-white",
  NEW: "bg-gold text-white",
};

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const cardRef = useRef(null);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.variants?.[0], 1);
    toast.success(`${product.name} added to cart`);
  };

  const onEnter = () => gsap.to(cardRef.current, { y: -6, duration: 0.3, ease: "power2.out" });
  const onLeave = () => gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: "power2.out" });

  return (
    <Link
      to={`/product/${product.slug}`}
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group block bg-white rounded-2xl shadow-card overflow-hidden border border-beige/60"
    >
      <div className="relative aspect-square bg-cream-dark overflow-hidden">
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-medium tracking-wide px-2.5 py-1 rounded-full z-10 ${badgeStyles[product.badge] || ""}`}>
            {product.badge}
          </span>
        )}
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 bg-white text-charcoal p-2.5 rounded-full shadow-soft opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold hover:text-white"
          aria-label="Quick add to cart"
        >
          <FiShoppingBag size={16} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-body font-medium text-charcoal text-sm truncate">{product.name}</h3>
        <p className="text-xs text-brown/70 mt-0.5 truncate">{product.tagline}</p>
        <div className="mt-2">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="text-sm" />
        </div>
        {product.numReviews > 0 && (
          <div className="mt-2">
            <StarRating rating={product.rating} size="text-xs" showCount count={product.numReviews} />
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
