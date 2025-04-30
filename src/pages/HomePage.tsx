
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "@/components/layout/HomeNavbar";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import HomeFooter from "@/components/layout/HomeFooter";
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-nexentry-blue"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <HomeFooter />
    </div>
  );
};

export default HomePage;
