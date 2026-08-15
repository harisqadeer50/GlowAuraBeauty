import { Link } from "react-router-dom";
import ScrollReveal from "../common/ScrollReveal";
import promoImg from "../../assets/special-promo.png";

const PromoBanner = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">

    {/* Desktop / Tablet version */}
    <ScrollReveal className="hidden sm:block relative rounded-3xl overflow-hidden">
      <div className="relative w-full aspect-[2188/718]">
        <img
          src={promoImg}
          alt="GlowAura Beauty featured products"
          className="absolute inset-0 w-full h-86 object-cover object-center"
        />
      </div>

      <div className="absolute left-[61%] top-[68%] -translate-x-1/2 -translate-y-1/2">
        <Link
          to="/shop"
          className="bg-charcoal text-white px-6 py-2.5 md:px-8 md:py-3.5 rounded-full text-xs md:text-sm font-medium hover:bg-gold-dark transition-colors whitespace-nowrap"
        >
          SHOP THE SALE
        </Link>
      </div>
    </ScrollReveal>

    {/* Mobile-only version */}
    <ScrollReveal className="sm:hidden relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#F8E4C0] via-[#F3D9A8] to-[#D9A552] p-7 text-center shadow-lg">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/30 rounded-full blur-2xl" />
      <div className="absolute -bottom-12 -right-8 w-44 h-44 bg-charcoal/10 rounded-full blur-2xl" />

      <div className="relative">
        <span className="inline-block bg-charcoal text-white text-[10px] font-semibold tracking-widest px-3 py-1 rounded-full mb-4">
          LIMITED TIME ONLY
        </span>

        <p className="text-charcoal/70 text-xs font-medium tracking-wide mb-1">
          SPECIAL OFFER
        </p>
        <h3 className="font-display text-3xl text-charcoal leading-tight">
          Up to <span className="text-gold-dark">30% Off</span>
        </h3>
        <p className="text-charcoal/70 text-sm mt-1.5">
          on selected products
        </p>

        <Link
          to="/shop"
          className="inline-block mt-6 bg-charcoal text-white px-8 py-3 rounded-full text-sm font-medium shadow-md hover:bg-gold-dark transition-colors"
        >
          SHOP THE SALE →
        </Link>
      </div>
    </ScrollReveal>

  </section>
);

export default PromoBanner;