import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/adminApi";
import { formatPKR } from "../../components/common/PriceTag";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi
      .getOrders(statusFilter ? { status: statusFilter } : {})
      .then((res) => setOrders(res.orders))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await adminApi.updateOrderStatus(id, { status });
      toast.success(`Order marked as ${status}`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl text-charcoal">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-beige rounded-full px-4 py-2 outline-none bg-white"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <button onClick={() => setExpandedId(expandedId === o._id ? null : o._id)} className="font-medium text-charcoal hover:text-gold-dark">
                    #{o.orderNumber}
                  </button>
                  <p className="text-xs text-brown/60 mt-0.5">
                    {o.user?.name} · {o.user?.email} · {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-charcoal">PKR {formatPKR(o.totalPrice)}</span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className="text-xs border border-beige rounded-full px-3 py-1.5 outline-none bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {expandedId === o._id && (
                <div className="mt-4 pt-4 border-t border-beige grid sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-medium text-charcoal mb-2">Items</p>
                    {o.items.map((item, i) => (
                      <p key={i} className="text-brown">
                        {item.name} {item.variant && `(${item.variant})`} × {item.quantity} — PKR {formatPKR(item.price * item.quantity)}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal mb-2">Shipping To</p>
                    <p className="text-brown">{o.shippingInfo.fullName}</p>
                    <p className="text-brown">{o.shippingInfo.house}, {o.shippingInfo.city}, {o.shippingInfo.province} {o.shippingInfo.postalCode}</p>
                    <p className="text-brown">{o.shippingInfo.phone}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-brown/60 py-8">No orders found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
