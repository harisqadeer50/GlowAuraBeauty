import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import gsap from "gsap";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";

const PublicLayout = () => {
  const location = useLocation();
  const mainRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => gsap.set(mainRef.current, { clearProps: "transform" }),
      }
    );
  }, [location.pathname]);

  useEffect(() => {
    if (!headerRef.current) return;
    const setVar = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${headerRef.current.offsetHeight}px`
      );
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={headerRef}>
        <Navbar />
      </div>
      <main ref={mainRef} className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default PublicLayout;