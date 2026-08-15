import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import heroImage from "../../assets/hero-section.webp"

const Hero = () => {
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.25")
      .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .fromTo(imgRef.current, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1 }, "-=0.9");
  }, []);

  return (
    <section className="bg-cream-dark flex items-stretch overflow-hidden min-h-[calc(100dvh-var(--header-h,0px))]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center py-8 md:py-10 w-full">
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <p ref={eyebrowRef} className="text-gold-dark text-sm tracking-[0.2em] font-medium mb-4">
            PREMIUM SKINCARE
          </p>
          <h1 ref={headingRef} className="font-display text-4xl md:text-6xl leading-[1.1] text-charcoal">
            Reveal Your <span className="text-gold-dark italic">Natural</span> Glow
          </h1>
          <p ref={subRef} className="text-brown mt-6 max-w-md leading-relaxed">
            Premium skincare powered by carefully selected ingredients for radiant, healthy &amp; beautiful looking skin.
          </p>
          <div ref={ctaRef} className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
            <Link to="/shop" className="bg-gold text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gold-dark transition-colors">
              SHOP NOW
            </Link>
            <Link to="/categories" className="border border-charcoal text-charcoal px-8 py-3.5 rounded-full text-sm font-medium hover:bg-white transition-colors">
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>

        <div ref={imgRef} className="relative h-full flex items-center justify-center">
         <div className="w-full max-w-sm md:max-w-md aspect-[4/5] max-h-[440px] md:max-h-[480px] rounded-[2.5rem] overflow-hidden shadow-soft">
  <img src={heroImage} alt="GlowAura skincare products" className="w-full h-full object-cover" />
</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;