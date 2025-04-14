
import React from "react";
import HomeNavbar from "@/components/layout/HomeNavbar";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";
import CTASection from "@/components/sections/CTASection";
import HomeFooter from "@/components/layout/HomeFooter";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <HomeFooter />
    </div>
  );
};

export default HomePage;
