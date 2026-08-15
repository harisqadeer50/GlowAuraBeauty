import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-charcoal text-cream mt-24 overflow-x-clip">
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <div>
        <span className="font-display text-2xl">GlowAura</span>
        <p className="text-cream/60 text-sm mt-4 leading-relaxed">
          Premium skincare crafted with selected ingredients for radiant, healthy-looking skin — naturally.
        </p>
        <div className="flex gap-4 mt-5 text-lg">
          <a href="https://www.instagram.com/glowaurabeauty.pk/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold-light">
            <FiInstagram />
          </a>
          <a href="https://www.facebook.com/share/1Hqtq2xqY2/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gold-light">
            <FiFacebook />
          </a>
          <a href="https://wa.me/923196249077" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-gold-light">
            <FaWhatsapp />
          </a>
        </div>
      </div>

      <div>
        <h4 className="font-display text-lg mb-4">Shop</h4>
        <ul className="space-y-2 text-sm text-cream/70">
          <li><Link to="/shop" className="hover:text-gold-light">All Products</Link></li>
          <li><Link to="/categories" className="hover:text-gold-light">Salon Care</Link></li>
          <li><Link to="/categories" className="hover:text-gold-light">Daily Care</Link></li>
          <li><Link to="/shop?sort=popularity" className="hover:text-gold-light">Best Sellers</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-lg mb-4">Support</h4>
        <ul className="space-y-2 text-sm text-cream/70">
          <li><Link to="/contact" className="hover:text-gold-light">Contact Us</Link></li>
          <li><Link to="/profile/orders" className="hover:text-gold-light">Track Order</Link></li>
          <li><Link to="/about" className="hover:text-gold-light">About Us</Link></li>
        </ul>
      </div>

      <div className="sm:col-span-2 lg:col-span-1">
        <h4 className="font-display text-lg mb-4">Newsletter</h4>
        <p className="text-cream/60 text-sm mb-3">Get updates on new arrivals and offers.</p>
        <form
          className="flex w-full max-w-sm rounded-lg overflow-hidden border border-cream/20 focus-within:border-gold"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Your email"
            required
            className="flex-1 min-w-0 px-3 py-2.5 bg-white text-charcoal text-sm outline-none placeholder:text-charcoal/40"
          />
          <button className="shrink-0 bg-gold px-4 text-sm font-medium text-charcoal hover:bg-gold-dark transition-colors">
            Join
          </button>
        </form>
      </div>
    </div>
    <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
      © {new Date().getFullYear()} GlowAura Beauty. All rights reserved.
    </div>
  </footer>
);

export default Footer;