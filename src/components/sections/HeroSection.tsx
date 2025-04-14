
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Repenser la façon dont vous <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">vendez.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          nexentry résume vos appels, génère vos relances, et optimise votre temps.
        </p>
        
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-4">
          <Input 
            type="email" 
            placeholder="Votre adresse email pro" 
            className="rounded-full border-gray-300 shadow-sm"
          />
          <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:shadow-lg transition-all">
            Essayer gratuitement
          </Button>
        </div>
        
        <a href="#" className="text-sm text-blue-600 hover:underline">J'ai un code d'invitation</a>
      </div>
    </section>
  );
};

export default HeroSection;
