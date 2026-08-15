import { FiTruck, FiShield, FiHeadphones, FiCheckCircle } from "react-icons/fi";

const badges = [
  { icon: FiCheckCircle, title: "Premium Ingredients", desc: "Carefully selected for best results" },
  { icon: FiShield, title: "Dermatologist Tested", desc: "Safe & effective for all skin types" },
  { icon: FiTruck, title: "Fast Delivery", desc: "Quick & reliable shipping" },
  { icon: FiHeadphones, title: "Customer Support", desc: "We're here to help anytime" },
];

const TrustBadges = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl shadow-card p-6 md:p-8">
      {badges.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="flex flex-col items-center text-center gap-2">
          <Icon className="text-gold-dark text-2xl" />
          <p className="text-sm font-medium text-charcoal">{title}</p>
          <p className="text-xs text-brown/70 hidden md:block">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBadges;
