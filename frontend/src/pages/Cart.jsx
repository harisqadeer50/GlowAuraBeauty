import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { formatPKR } from "../components/common/PriceTag";
import ProductImage from "../components/common/ProductImage";

const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 200;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-charcoal mb-3">Your Cart is Empty</h1>
        <p className="text-brown mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="bg-gold text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.variant}`} className="flex gap-4 bg-white rounded-2xl shadow-card p-4">
              <ProductImage src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover bg-cream-dark flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-charcoal">{item.name}</p>
                    {item.variant && <p className="text-xs text-brown/60">{item.variant}</p>}
                  </div>
                  <button onClick={() => removeItem(item.productId, item.variant)} className="text-brown/50 hover:text-red-500">
                    <FiTrash2 size={18} />
                  </button>
                </div>
                <p className="text-gold-dark font-semibold mt-2">PKR {formatPKR(item.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-beige rounded-full">
                    <button className="p-2 hover:text-gold-dark" onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}>
                      <FiMinus size={14} />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button className="p-2 hover:text-gold-dark" onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="text-sm text-brown/60">= PKR {formatPKR(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 h-fit sticky top-24">
          <h3 className="font-display text-xl text-charcoal mb-5">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-brown">
              <span>Subtotal</span>
              <span className="text-charcoal">PKR {formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-brown">
              <span>Shipping</span>
              <span className="text-charcoal">{shipping === 0 ? "Free" : `PKR ${formatPKR(shipping)}`}</span>
            </div>
            <div className="border-t border-beige pt-3 flex justify-between font-semibold text-charcoal">
              <span>Total</span>
              <span>PKR {formatPKR(total)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block text-center bg-gold text-white py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors mt-6"
          >
            PROCEED TO CHECKOUT
          </Link>
          <Link to="/shop" className="block text-center text-sm text-brown mt-4 hover:text-gold-dark">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
