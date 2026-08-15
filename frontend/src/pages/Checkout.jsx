import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../api/orderApi";
import { formatPKR } from "../components/common/PriceTag";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  house: z.string().min(3, "Address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z.string().min(4, "Postal code is required"),
});

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: user ? { fullName: user.name, phone: user.phone } : {},
  });

  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 200;
  const total = subtotal + shipping;

  if (!user) return <Navigate to="/login" state={{ from: { pathname: "/checkout" } }} replace />;
  if (items.length === 0) return <Navigate to="/shop" replace />;

  const onSubmit = async (shippingInfo) => {
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ product: i.productId, name: i.name, variant: i.variant, quantity: i.quantity })),
        shippingInfo,
      };
      const res = await orderApi.create(payload);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${res.order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display text-3xl text-charcoal mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-[1fr_360px] gap-10">
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h3 className="font-display text-xl text-charcoal mb-1">Shipping Information</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-brown">Full Name</label>
              <input {...register("fullName")} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-sm text-brown">Phone Number</label>
              <input {...register("phone")} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" placeholder="+92 3XX XXXXXXX" />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm text-brown">House #, Street, Area</label>
            <input {...register("house")} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
            {errors.house && <p className="text-xs text-red-500 mt-1">{errors.house.message}</p>}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-brown">City</label>
              <input {...register("city")} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="text-sm text-brown">Province</label>
              <input {...register("province")} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
              {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province.message}</p>}
            </div>
            <div>
              <label className="text-sm text-brown">Postal Code</label>
              <input {...register("postalCode")} className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold" />
              {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-beige">
            <h3 className="font-display text-xl text-charcoal mb-3">Payment Method</h3>
            <div className="flex items-center gap-3 border border-gold bg-gold/5 rounded-xl p-4">
              <span className="w-4 h-4 rounded-full bg-gold flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-charcoal">Cash on Delivery (COD)</p>
                <p className="text-xs text-brown/60">Pay with cash when your order arrives</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 h-fit sticky top-24">
          <h3 className="font-display text-xl text-charcoal mb-5">Order Summary</h3>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variant}`} className="flex justify-between text-sm">
                <span className="text-brown truncate pr-2">
                  {item.name} {item.variant && `(${item.variant})`} × {item.quantity}
                </span>
                <span className="text-charcoal whitespace-nowrap">PKR {formatPKR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-beige pt-4">
            <div className="flex justify-between text-brown">
              <span>Subtotal</span>
              <span className="text-charcoal">PKR {formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-brown">
              <span>Shipping</span>
              <span className="text-charcoal">{shipping === 0 ? "Free" : `PKR ${formatPKR(shipping)}`}</span>
            </div>
            <div className="border-t border-beige pt-3 flex justify-between font-semibold text-charcoal text-base">
              <span>Total</span>
              <span>PKR {formatPKR(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={placing}
            className="w-full bg-gold text-white py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors mt-6 disabled:opacity-50"
          >
            {placing ? "Placing Order..." : "PLACE ORDER"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
