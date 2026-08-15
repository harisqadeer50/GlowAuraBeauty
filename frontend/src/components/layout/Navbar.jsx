import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from "react-icons/fi";
import gsap from "gsap";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/categories" },
  { label: "Best Sellers", to: "/shop?sort=popularity" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const Navbar = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => gsap.set(navRef.current, { clearProps: "transform" }),
      }
    );
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <header ref={navRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-beige overflow-x-clip">
      {/* Announcement bar */}
      <div className="hidden lg:flex items-center justify-center gap-8 bg-charcoal text-cream text-xs tracking-wide py-2 font-body">
        <span>FREE SHIPPING on orders over PKR 5,000</span>
        <span className="opacity-40">|</span>
        <span>Glow Naturally. Shine Confidently.</span>
        <span className="opacity-40">|</span>
        <span>100% Authentic Products</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-20">
        <button className="lg:hidden text-2xl text-charcoal" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <FiMenu />
        </button>

        <Link to="/" className="flex flex-col items-center leading-none">
          <span className="font-display text-2xl md:text-3xl tracking-wide text-charcoal">GLOWAURA</span>
          <span className="text-[10px] md:text-xs tracking-[0.35em] text-gold-dark mt-0.5">BEAUTY</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 font-body text-sm text-charcoal whitespace-nowrap">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-gold-dark transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5 text-charcoal text-lg">
          <button aria-label="Search" onClick={() => setSearchOpen((v) => !v)} className="hover:text-gold-dark">
            <FiSearch />
          </button>
          <Link to={user ? "/profile" : "/login"} aria-label="Account" className="hover:text-gold-dark hidden sm:block">
            <FiUser />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="hover:text-gold-dark hidden sm:block relative">
            <FiHeart />
          </Link>
          <button aria-label="Cart" onClick={() => setIsCartOpen(true)} className="relative hover:text-gold-dark">
            <FiShoppingBag />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t border-beige bg-cream py-3 px-4">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <FiSearch className="text-brown" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for serums, kits, cleansers..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-brown/60"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-brown">
              <FiX />
            </button>
          </div>
        </form>
      )}

      {/* Mobile / tablet drawer — portalled to body so it's never trapped by an
          ancestor's transform (GSAP leaves one on the header after its
          entrance animation, which would otherwise break position:fixed here) */}
      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-charcoal/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-soft p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl text-charcoal">GlowAura</span>
                <button onClick={() => setMobileOpen(false)} className="text-xl">
                  <FiX />
                </button>
              </div>
              <nav className="flex flex-col gap-4 font-body text-charcoal">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="py-1 border-b border-beige">
                    {link.label}
                  </Link>
                ))}
                <Link to={user ? "/profile" : "/login"} onClick={() => setMobileOpen(false)} className="py-1">
                  {user ? "My Profile" : "Login / Register"}
                </Link>
              </nav>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default Navbar;