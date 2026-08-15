import { useEffect, useRef } from "react";
import gsap from "gsap";

// Lightweight scroll-reveal without the ScrollTrigger plugin: uses
// IntersectionObserver to trigger a GSAP tween the first time an element
// enters the viewport. Keeps bundle size small and respects reduced motion.
const ScrollReveal = ({ children, className = "", y = 30, delay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.7, delay, ease: "power2.out" });
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [y, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
