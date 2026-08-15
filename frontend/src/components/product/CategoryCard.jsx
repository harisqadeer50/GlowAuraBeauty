import { Link } from "react-router-dom";

const CategoryCard = ({ title, count, image, icon: Icon, to, tone = "gold" }) => {
  const tones = {
    gold: "bg-gradient-to-br from-[#F7EEDD] to-[#F0E2C4]",
    green: "bg-gradient-to-br from-[#EFF3E9] to-[#DCE6D0]",
  };

  return (
    <Link
      to={to}
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row md:items-stretch md:min-h-[260px] ${tones[tone]} group`}
    >
      {/* Left: icon, title, count, CTA */}
      <div className="relative z-10 flex flex-col items-center md:items-start justify-center text-center md:text-left gap-1 md:gap-2.5 px-4 md:px-9 py-3 md:py-8 w-full md:w-1/2">
        {Icon && (
          <div className="w-6 h-6 md:w-9 md:h-9 rounded-full border border-gold-dark/40 flex items-center justify-center text-gold-dark">
            <Icon size={11} className="md:hidden" />
            <Icon size={16} className="hidden md:block" />
          </div>
        )}
        <h3 className="font-display text-sm sm:text-base md:text-2xl text-charcoal leading-tight">{title}</h3>
        <p className="text-[11px] md:text-sm text-brown">{count} Categories</p>
        <span className="inline-block border border-charcoal text-charcoal text-[9px] md:text-xs font-medium tracking-wide px-2.5 md:px-5 py-1 md:py-2.5 rounded-full w-fit mt-0.5 md:mt-2 group-hover:bg-charcoal group-hover:text-white transition-colors">
          SHOP NOW
        </span>
      </div>

      {/* Right: product photography. Normal flow (stacked below text) on
          mobile — compact height since cards are only ~half-width on a
          2-column mobile grid; bleeds to the bottom-right via absolute
          positioning from md up, where there's a full-width single card. */}
      {image && (
        <div className="relative w-full h-24 sm:h-28 mx-auto md:absolute md:right-8 md:bottom-14 md:w-1/2 md:h-[92%]">
          <img
            src={image}
            alt={`${title} products`}
            className="w-full h-full md:h-[130%] object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
    </Link>
  );
};

export default CategoryCard;
