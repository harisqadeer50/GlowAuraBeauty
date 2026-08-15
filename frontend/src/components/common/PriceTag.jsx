const formatPKR = (value) =>
  new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(value);

const PriceTag = ({ price, compareAtPrice, size = "text-base" }) => {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPct = hasDiscount ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <span className="inline-flex items-baseline gap-2 flex-wrap">
      <span className={`font-semibold text-charcoal ${size}`}>PKR {formatPKR(price)}</span>
      {hasDiscount && (
        <>
          <span className="text-brown/60 line-through text-sm">PKR {formatPKR(compareAtPrice)}</span>
          <span className="text-xs font-medium text-white bg-gold-dark px-2 py-0.5 rounded-full">
            {discountPct}% OFF
          </span>
        </>
      )}
    </span>
  );
};

export default PriceTag;
export { formatPKR };
