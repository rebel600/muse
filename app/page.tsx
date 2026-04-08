import AnimateMouse from "@/components/animate-mouse";
import HeroSection from "@/components/hero-section";
import FeaturesGrid from "@/components/features-grid";
import PlatformShowcase from "@/components/platform-showcase";
import SocialProof from "@/components/social-proof";
import Testimonials from "@/components/testimonials";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0 bg-linear-to-br from-purple-900/20  via-red-900/20 to-yellow-900/20 animate-pulse" />
      <AnimateMouse />

      {/*  Hero Section */}
      <HeroSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Platform Showcase */}
      <PlatformShowcase />

      {/* Social Proof */}
      <SocialProof />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
