import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl text-charcoal text-center mb-2">Welcome Back</h1>
      <p className="text-brown text-center mb-8">Login to your GlowAura account</p>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm text-brown">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-sm text-brown">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </div>
        <div className="text-right">
  <Link to="/forgot-password" className="text-xs text-gold-dark hover:underline">
    Forgot Password?
  </Link>
</div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-white py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>
      </form>

      <p className="text-center text-sm text-brown mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-gold-dark font-medium hover:underline">Register</Link>
      </p>
    </div>
  );
};

export default Login;
