import Hero from "../components/home/Hero";
import ShopByCategory from "../components/home/ShopByCategory";
import BestSellers from "../components/home/BestSellers";
import PromoBanner from "../components/home/PromoBanner";
import TrustBadges from "../components/home/TrustBadges";
import OurHappyCustomers from "../components/home/OurHappyCustomers";

const Home = () => (
  <div>
    <Hero />
    <ShopByCategory />
    <BestSellers />
    <PromoBanner />
    <TrustBadges />
    <OurHappyCustomers />
  </div>
);

export default Home;
