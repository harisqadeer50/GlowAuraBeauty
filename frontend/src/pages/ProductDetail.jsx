import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiMinus, FiPlus, FiHeart, FiShare2, FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { productApi } from "../api/productApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PriceTag from "../components/common/PriceTag";
import StarRating from "../components/common/StarRating";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProductImage from "../components/common/ProductImage";

const TABS = ["Product Description", "How to Use", "Ingredients", "Shipping & Returns", "Reviews"];

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openTab, setOpenTab] = useState("Product Description");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    productApi
      .getBySlug(slug)
      .then((res) => {
        setProduct(res.product);
        setSelectedVariant(res.product.variants?.[0] || null);
        setActiveImage(0);
        setQuantity(1);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner full />;
  if (!product) return <p className="text-center py-20">Product not found.</p>;

  const unitPrice = product.price + (selectedVariant?.priceModifier || 0);
  const maxStock = selectedVariant?.stock ?? product.stock;

  const handleAddToCart = () => {
    if (maxStock < 1) {
      toast.error("This item is out of stock");
      return;
    }
    addItem(product, selectedVariant, quantity);
    toast.success("Added to cart");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to leave a review");
      return;
    }
    setSubmittingReview(true);
    try {
      await productApi.addReview(product._id, reviewForm);
      toast.success("Review submitted");
      const res = await productApi.getBySlug(slug);
      setProduct(res.product);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review? This can't be undone.")) return;
    try {
      await productApi.deleteReview(product._id, reviewId);
      toast.success("Review deleted");
      const res = await productApi.getBySlug(slug);
      setProduct(res.product);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <p className="text-xs text-brown/60 mb-6">
        <Link to="/" className="hover:text-gold-dark">Home</Link> /{" "}
        <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-gold-dark">
          {product.category?.name}
        </Link>{" "}
        / {product.name}
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-cream-dark">
            <ProductImage src={product.images?.[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${activeImage === i ? "border-gold" : "border-transparent"}`}
                >
                  <ProductImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="font-display text-3xl text-charcoal">{product.name}</h1>
          <p className="text-brown mt-1">{product.tagline}</p>

          <div className="flex items-center gap-3 mt-3">
            <StarRating rating={product.rating} showCount count={product.numReviews} />
            {product.soldCount > 0 && <span className="text-xs text-brown/50">| {product.soldCount}+ sold</span>}
          </div>

          <div className="mt-5">
            <PriceTag price={unitPrice} compareAtPrice={product.compareAtPrice} size="text-2xl" />
          </div>

          <p className="text-brown mt-5 leading-relaxed">{product.description}</p>

          {product.variants?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-charcoal mb-2">Size</p>
              <div className="flex gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      selectedVariant?.label === v.label ? "border-gold bg-gold/10 text-gold-dark" : "border-beige text-brown"
                    }`}
                  >
                    {v.label} {v.priceModifier > 0 && `(+${v.priceModifier})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-beige rounded-full">
              <button className="p-3 hover:text-gold-dark" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <FiMinus size={14} />
              </button>
              <span className="px-4 text-sm w-8 text-center">{quantity}</span>
              <button className="p-3 hover:text-gold-dark" onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))} aria-label="Increase quantity">
                <FiPlus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={maxStock < 1}
              className="flex-1 border border-charcoal text-charcoal py-3 rounded-full text-sm font-medium hover:bg-cream transition-colors disabled:opacity-40"
            >
              {maxStock < 1 ? "OUT OF STOCK" : "ADD TO CART"}
            </button>
            <Link
              to="/checkout"
              onClick={() => maxStock >= 1 && addItem(product, selectedVariant, quantity)}
              className="flex-1 text-center bg-gold text-white py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors"
            >
              BUY NOW
            </Link>
          </div>

          <div className="flex items-center gap-6 mt-5 text-sm text-brown">
            <button className="flex items-center gap-1.5 hover:text-gold-dark">
              <FiHeart /> Add to Wishlist
            </button>
            <button className="flex items-center gap-1.5 hover:text-gold-dark">
              <FiShare2 /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 max-w-4xl">
        {TABS.map((tab) => (
          <div key={tab} className="border-b border-beige">
            <button
              onClick={() => setOpenTab(openTab === tab ? "" : tab)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="font-medium text-charcoal">{tab}</span>
              <FiChevronDown className={`transition-transform text-brown ${openTab === tab ? "rotate-180" : ""}`} />
            </button>
            {openTab === tab && (
              <div className="pb-5 text-sm text-brown leading-relaxed">
                {tab === "Product Description" && <p>{product.description}</p>}
                {tab === "How to Use" && <p>{product.howToUse || "No usage instructions provided."}</p>}
                {tab === "Ingredients" && <p>{product.ingredients || "No ingredients listed."}</p>}
                {tab === "Shipping & Returns" && (
                  <p>Free shipping on orders over PKR 5,000. Standard delivery in 3–5 business days across Pakistan. Cash on Delivery only.</p>
                )}
                {tab === "Reviews" && (
                  <div className="space-y-6">
                    {product.reviews?.length === 0 && <p>No reviews yet — be the first to review this product.</p>}
                    {product.reviews?.map((r, i) => {
                      const canDelete = user && (user.role === "admin" || r.user?._id === user._id);
                      return (
                        <div key={i} className="border-b border-beige pb-4 last:border-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-charcoal text-sm">{r.name}</span>
                              <StarRating rating={r.rating} size="text-xs" />
                            </div>
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteReview(r._id)}
                                className="text-xs text-brown/50 hover:text-red-500 transition-colors"
                                aria-label="Delete review"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <p className="mt-1">{r.comment}</p>
                        </div>
                      );
                    })}

                    <form onSubmit={submitReview} className="pt-2">
                      <p className="font-medium text-charcoal text-sm mb-2">Write a review</p>
                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            type="button"
                            key={n}
                            onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                            className={n <= reviewForm.rating ? "text-gold" : "text-brown/30"}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                        required
                        rows={3}
                        placeholder="Share your experience with this product..."
                        className="w-full border border-beige rounded-xl p-3 text-sm outline-none focus:border-gold"
                      />
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="mt-3 bg-gold text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
                      >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
