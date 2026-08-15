import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-2xl mx-auto px-4 py-24 text-center">
    <h1 className="font-display text-6xl text-gold-dark mb-4">404</h1>
    <p className="text-brown mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" className="bg-gold text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gold-dark">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
