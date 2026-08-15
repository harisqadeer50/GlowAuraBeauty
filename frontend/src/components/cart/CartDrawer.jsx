import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiX, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import gsap from "gsap";
import { useCart } from "../../context/CartContext";
import { formatPKR } from "../common/PriceTag";
import ProductImage from "../common/ProductImage";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal } = useCart();
  const panelRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isCartOpen) {
      gsap.set(panelRef.current, { x: "100%" });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.25 });
      gsap.to(panelRef.current, { x: "0%", duration: 0.4, ease: "power3.out" });
    }
  }, [isCartOpen]);

  const close = () => {
    gsap.to(panelRef.current, { x: "100%", duration: 0.3, ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: () => setIsCartOpen(false) });
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div ref={overlayRef} className="absolute inset-0 bg-charcoal/40" onClick={close} />
      <div ref={panelRef} className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-soft flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-beige">
          <h3 className="font-display text-xl text-charcoal">Your Cart</h3>
          <button onClick={close} className="text-xl text-brown hover:text-charcoal" aria-label="Close cart">
            <FiX />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 && (
            <div className="text-center text-brown/70 py-16">
              <p className="font-body">Your cart is empty.</p>
              <Link to="/shop" onClick={close} className="inline-block mt-4 text-gold-dark underline">
                Start shopping
              </Link>
            </div>
          )}

          {items.map((item) => (
            <div key={`${item.productId}-${item.variant}`} className="flex gap-4">
              <ProductImage
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover bg-cream-dark flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-charcoal text-sm truncate">{item.name}</p>
                {item.variant && <p className="text-xs text-brown/60">{item.variant}</p>}
                <p className="text-sm text-gold-dark font-semibold mt-1">PKR {formatPKR(item.price)}</p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-beige rounded-full">
                    <button
                      className="p-1.5 hover:text-gold-dark"
                      onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="px-2 text-sm">{item.quantity}</span>
                    <button
                      className="p-1.5 hover:text-gold-dark"
                      onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variant)}
                    className="text-brown/50 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-beige px-6 py-5 space-y-4">
            <div className="flex justify-between text-sm text-brown">
              <span>Subtotal</span>
              <span className="text-charcoal font-semibold">PKR {formatPKR(subtotal)}</span>
            </div>
            <Link
              to="/cart"
              onClick={close}
              className="block text-center border border-charcoal text-charcoal py-3 rounded-full text-sm font-medium hover:bg-cream transition-colors"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              onClick={close}
              className="block text-center bg-gold text-white py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
