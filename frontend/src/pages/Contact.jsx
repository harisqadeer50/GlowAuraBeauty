import { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import api from "../api/axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent — we'll get back to you soon!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="font-display text-4xl text-charcoal mb-6">Contact Us</h1>
        <p className="text-brown leading-relaxed mb-8">
          Have a question about an order, a product, or anything else? We'd love to hear from you.
        </p>
        <div className="space-y-4 text-sm text-brown">
          <p className="flex items-center gap-3"><FiMail className="text-gold-dark" /> support@glowaura.com</p>
          <p className="flex items-center gap-3"><FiPhone className="text-gold-dark" /> +92 923196249077</p>
          <p className="flex items-center gap-3"><FiMapPin className="text-gold-dark" /> Lahore, Pakistan</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-4 h-fit">
        <input
          required
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          type="email"
          required
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <textarea
          required
          rows={5}
          placeholder="Your Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-beige rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gold text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gold-dark w-full disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;