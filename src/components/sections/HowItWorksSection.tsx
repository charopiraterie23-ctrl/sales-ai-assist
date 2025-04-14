
import React from "react";
import StepCard from "@/components/cards/StepCard";

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">3 étapes, et c'est fait.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard
            number="1"
            title="Enregistrez ou uploadez un appel"
            description="Utilisez notre app pour enregistrer un appel ou importez un fichier audio."
          />
          <StepCard
            number="2"
            title="Recevez un résumé et une relance"
            description="Notre IA génère instantanément un résumé et une proposition d'email de suivi."
          />
          <StepCard
            number="3"
            title="Envoyez depuis votre propre email"
            description="Validez, modifiez si besoin, et envoyez directement depuis notre interface."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
