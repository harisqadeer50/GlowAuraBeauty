import { useState } from "react";

// Since this project uses no placeholder/online images, missing local images
// (e.g. before real assets are uploaded via the admin panel) fall back to a
// soft branded tile instead of a broken image icon.
const ProductImage = ({ src, alt, className }) => {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={`flex items-center justify-center bg-cream-dark text-brown/40 text-xs text-center px-4 ${className}`}>
        Image not uploaded yet
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setErrored(true)} />;
};

export default ProductImage;
