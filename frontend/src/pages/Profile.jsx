import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import { orderApi } from "../api/orderApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatPKR } from "../components/common/PriceTag";

const STATUS_STYLES = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const TABS = ["Account", "Addresses", "Orders"];

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Account");
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);
  const [addressForm, setAddressForm] = useState({ fullName: "", phone: "", house: "", city: "", province: "", postalCode: "" });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (tab === "Orders") {
      setOrdersLoading(true);
      orderApi
        .getMine()
        .then((res) => setOrders(res.orders))
        .finally(() => setOrdersLoading(false));
    }
  }, [tab]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile(profileForm);
      await refreshUser();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      await authApi.addAddress(addressForm);
      await refreshUser();
      toast.success("Address added");
      setAddressForm({ fullName: "", phone: "", house: "", city: "", province: "", postalCode: "" });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-charcoal">My Account</h1>
        <button onClick={handleLogout} className="text-sm text-brown hover:text-red-500">Logout</button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-beige">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
              tab === t ? "border-gold text-gold-dark" : "border-transparent text-brown hover:text-charcoal"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Account" && (
        <form onSubmit={saveProfile} className="bg-white rounded-2xl shadow-card p-6 max-w-md space-y-4">
          <div>
            <label className="text-sm text-brown">Full Name</label>
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-sm text-brown">Email</label>
            <input value={user?.email} disabled className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm bg-cream text-brown/60" />
          </div>
          <div>
            <label className="text-sm text-brown">Phone</label>
            <input
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
            />
          </div>
          <button type="submit" disabled={saving} className="bg-gold text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gold-dark disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {tab === "Addresses" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {user?.addresses?.length === 0 && <p className="text-brown/60 text-sm">No saved addresses yet.</p>}
            {user?.addresses?.map((a) => (
              <div key={a._id} className="bg-white rounded-2xl shadow-card p-5">
                <p className="font-medium text-charcoal text-sm">{a.fullName}</p>
                <p className="text-sm text-brown mt-1">{a.house}, {a.city}, {a.province} {a.postalCode}</p>
                <p className="text-sm text-brown/60 mt-1">{a.phone}</p>
                {a.isDefault && <span className="inline-block mt-2 text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">Default</span>}
              </div>
            ))}
          </div>

          <form onSubmit={addAddress} className="bg-white rounded-2xl shadow-card p-6 space-y-3 h-fit">
            <h3 className="font-medium text-charcoal mb-1">Add New Address</h3>
            {["fullName", "phone", "house", "city", "province", "postalCode"].map((field) => (
              <input
                key={field}
                required
                placeholder={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                value={addressForm[field]}
                onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })}
                className="w-full border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            ))}
            <button type="submit" className="w-full bg-gold text-white py-2.5 rounded-full text-sm font-medium hover:bg-gold-dark">
              Save Address
            </button>
          </form>
        </div>
      )}

      {tab === "Orders" && (
        <div>
          {ordersLoading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <p className="text-brown/60 text-sm">You haven't placed any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o._id} className="bg-white rounded-2xl shadow-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-charcoal">#{o.orderNumber}</p>
                      <p className="text-xs text-brown/60">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </div>
                  <div className="mt-3 space-y-1">
                    {o.items.map((item, i) => (
                      <p key={i} className="text-sm text-brown">
                        {item.name} {item.variant && `(${item.variant})`} × {item.quantity}
                      </p>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-beige">
                    <span className="text-sm text-brown">Total</span>
                    <span className="font-semibold text-charcoal">PKR {formatPKR(o.totalPrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
