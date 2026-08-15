import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { orderApi } from "../api/orderApi";
import { formatPKR } from "../components/common/PriceTag";
import LoadingSpinner from "../components/common/LoadingSpinner";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getById(id)
      .then((res) => setOrder(res.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner full />;
  if (!order) return <p className="text-center py-20">Order not found.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <FiCheckCircle className="text-6xl text-gold mx-auto mb-5" />
      <h1 className="font-display text-3xl text-charcoal mb-2">Order Placed!</h1>
      <p className="text-brown mb-8">
        Thank you — your order <span className="font-medium text-charcoal">#{order.orderNumber}</span> has been received and will be delivered via Cash on Delivery.
      </p>

      <div className="bg-white rounded-2xl shadow-card p-6 text-left">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-beige last:border-0">
            <span className="text-brown">{item.name} {item.variant && `(${item.variant})`} × {item.quantity}</span>
            <span className="text-charcoal">PKR {formatPKR(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-charcoal pt-3 mt-2">
          <span>Total (COD)</span>
          <span>PKR {formatPKR(order.totalPrice)}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Link to="/profile/orders" className="border border-charcoal text-charcoal px-6 py-3 rounded-full text-sm font-medium hover:bg-cream">
          Track Order
        </Link>
        <Link to="/shop" className="bg-gold text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gold-dark">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
