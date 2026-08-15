import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "glowaura_cart";

const lineKey = (item) => `${item.productId}__${item.variant || "default"}`;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, variant, quantity = 1) => {
    const unitPrice = product.price + (variant?.priceModifier || 0);
    const newLine = {
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0],
      variant: variant?.label || null,
      price: unitPrice,
      quantity,
      maxStock: variant?.stock ?? product.stock,
    };

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => lineKey(i) === lineKey(newLine));
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, newLine.maxStock);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, newLine];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, variant, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variant === variant
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
          : i
      )
    );
  };

  const removeItem = (productId, variant) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.variant === variant)));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
