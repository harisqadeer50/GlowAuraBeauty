import { useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiUsers, FiExternalLink, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/users", label: "Users", icon: FiUsers },
];

const AdminLayout = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (onLinkClick) => (
    <>
      <div className="px-6 py-6 border-b border-cream/10">
        <span className="font-display text-xl">GlowAura</span>
        <p className="text-xs text-cream/50 mt-0.5">Admin Panel</p>
      </div>
      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-gold text-white" : "text-cream/70 hover:bg-white/5 hover:text-cream"
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-5 border-t border-cream/10">
        <p className="text-xs text-cream/50">{user?.name}</p>
        <a href="/" className="flex items-center gap-1.5 text-xs text-gold-light mt-2 hover:underline">
          <FiExternalLink size={12} /> View Store
        </a>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop sidebar */}
      <aside className="w-64 bg-charcoal text-cream flex-shrink-0 hidden md:flex flex-col">
        {sidebarContent()}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-charcoal text-cream flex items-center justify-between px-4 h-14">
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="text-2xl">
          <FiMenu />
        </button>
        <span className="font-display text-lg">GlowAura Admin</span>
        <span className="w-6" />
      </div>

      {/* Mobile drawer — portalled to body so it isn't clipped by any
          ancestor's overflow/transform */}
      {mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-charcoal/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-charcoal text-cream flex flex-col shadow-soft">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="self-end mr-4 mt-4 text-xl text-cream/70 hover:text-cream"
              >
                <FiX />
              </button>
              {sidebarContent(() => setMobileOpen(false))}
            </div>
          </div>,
          document.body
        )}

      <main className="flex-1 p-5 md:p-8 pt-20 md:pt-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;