import { useEffect, useState } from "react";
import { FiBox, FiUsers, FiShoppingBag, FiDollarSign, FiAlertTriangle } from "react-icons/fi";
import { adminApi } from "../../api/adminApi";
import { formatPKR } from "../../components/common/PriceTag";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-gold/10 text-gold-dark flex items-center justify-center flex-shrink-0">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-brown/60">{label}</p>
      <p className="text-xl font-semibold text-charcoal">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((res) => setStats(res.stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner full />;
  if (!stats) return null;

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiBox} label="Total Products" value={stats.totalProducts} />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats.totalOrders} />
        <StatCard icon={FiUsers} label="Total Customers" value={stats.totalCustomers} />
        <StatCard icon={FiDollarSign} label="Revenue" value={`PKR ${formatPKR(stats.revenue)}`} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-display text-lg text-charcoal mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {Object.entries(stats.statusBreakdown).length === 0 && (
              <p className="text-sm text-brown/60">No orders yet.</p>
            )}
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-brown">{status}</span>
                <span className="font-medium text-charcoal">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-display text-lg text-charcoal mb-4 flex items-center gap-2">
            <FiAlertTriangle className="text-amber-500" /> Low Stock Products
          </h3>
          <div className="space-y-3">
            {stats.lowStockProducts.length === 0 && <p className="text-sm text-brown/60">All products are well stocked.</p>}
            {stats.lowStockProducts.map((p) => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <span className="text-brown truncate pr-2">{p.name}</span>
                <span className="font-medium text-red-500">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
