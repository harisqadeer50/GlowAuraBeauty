import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import ProductCard from "../components/product/ProductCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Wishlist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    authApi
      .getWishlist()
      .then((res) => setItems(res.wishlist))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-charcoal mb-3">Your Wishlist</h1>
        <p className="text-brown mb-8">Log in to save and view your favorite products.</p>
        <Link to="/login" className="bg-gold text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gold-dark">
          Login
        </Link>
      </div>
    );
  }

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">Your Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-brown/60">You haven't saved any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {items.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
