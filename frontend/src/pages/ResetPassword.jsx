import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, form.password);
      localStorage.setItem("glowaura_token", res.token);
      await refreshUser();
      toast.success("Password reset — you're now logged in");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl text-charcoal text-center mb-2">Reset Password</h1>
      <p className="text-brown text-center mb-8">Choose a new password for your account.</p>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm text-brown">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-sm text-brown">Confirm New Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-white py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Resetting..." : "RESET PASSWORD"}
        </button>
      </form>

      <p className="text-center text-sm text-brown mt-6">
        <Link to="/login" className="text-gold-dark font-medium hover:underline">Back to Login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;