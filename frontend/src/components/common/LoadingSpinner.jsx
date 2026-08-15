const LoadingSpinner = ({ full }) => (
  <div className={`flex items-center justify-center ${full ? "min-h-[60vh]" : "py-10"}`}>
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-beige"></div>
      <div className="absolute inset-0 rounded-full border-4 border-gold border-t-transparent animate-spin"></div>
    </div>
  </div>
);

export default LoadingSpinner;
