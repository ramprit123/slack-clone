import FooterSection from "@/components/footer";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/hero-section";

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroHeader />
      <HeroSection />
      <FooterSection />
    </div>
  );
};
export default Home;
