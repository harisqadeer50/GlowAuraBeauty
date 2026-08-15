import { FaLeaf } from "react-icons/fa";
import { FiDroplet } from "react-icons/fi";
import CategoryCard from "../product/CategoryCard";
import ScrollReveal from "../common/ScrollReveal";
import salonCareImage from "../../assets/salon-care.png";
import dailyCareImage from "../../assets/daily-care.png";

const ShopByCategory = () => (
  <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
    <ScrollReveal className="text-center mb-10">
      <h2 className="font-display text-3xl text-charcoal">Shop By Category</h2>
    </ScrollReveal>
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
      <ScrollReveal>
        <CategoryCard
          title="Salon Care"
          count={7}
          to="/categories?group=Salon Care"
          tone="gold"
          icon={FaLeaf}
          image={salonCareImage}
        />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <CategoryCard
          title="Daily Care"
          count={7}
          to="/categories?group=Daily Care"
          tone="green"
          icon={FiDroplet}
          image={dailyCareImage}
        />
      </ScrollReveal>
    </div>
  </section>
);

export default ShopByCategory;
