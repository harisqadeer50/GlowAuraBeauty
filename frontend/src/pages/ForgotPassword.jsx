import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent — check your email");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl text-charcoal text-center mb-2">Forgot Password</h1>
      <p className="text-brown text-center mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <div className="bg-white rounded-2xl shadow-card p-6">
        {sent ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-charcoal">
              If an account exists for <span className="font-medium">{email}</span>, a reset link has been sent.
            </p>
            <p className="text-xs text-brown/60">Check your spam folder if it doesn't arrive within a few minutes.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-brown">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-white py-3 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "SEND RESET LINK"}
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-sm text-brown mt-6">
        Remembered your password?{" "}
        <Link to="/login" className="text-gold-dark font-medium hover:underline">Back to Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;