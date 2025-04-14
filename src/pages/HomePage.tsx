import React from "react";
import HomeNavbar from "@/components/layout/HomeNavbar";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import HomeFooter from "@/components/layout/HomeFooter";
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user } = useAuth();
  
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
        
        {user && (
          <div className="bg-nexentry-blue text-white py-3 text-center">
            <Link to="/dashboard" className="font-medium hover:underline">
              Accéder à mon tableau de bord →
            </Link>
          </div>
        )}
      </main>
      <HomeFooter />
    </div>
  );
};

export default HomePage;
