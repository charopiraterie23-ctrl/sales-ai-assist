
import React from "react";
import PricingCard from "@/components/pricing/PricingCard";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path: string) => {
    navigate(path);
  };

  return (
    <section id="pricing" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Des plans adaptés à vos besoins</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Testez gratuitement. Passez à Pro quand vous êtes prêt.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Free"
            price="0€"
            description="Pour tester l'expérience"
            features={[
              "Jusqu'à 3 résumés/mois",
              "Résumés uniquement",
              "1 contact"
            ]}
            buttonText="Commencer gratuitement"
            onClick={() => handleButtonClick("/register")}
            highlight={false}
          />
          <PricingCard
            title="Pro"
            price="19€"
            badge="Le plus populaire"
            description="Pour les professionnels"
            features={[
              "Résumés illimités",
              "Emails de suivi",
              "Contacts illimités",
              "Support prioritaire",
              "Partage des résumés"
            ]}
            buttonText="Passer au Pro"
            onClick={() => handleButtonClick("/register")}
            highlight={true}
          />
          <PricingCard
            title="Équipe"
            price="199€"
            description="Pour les équipes"
            features={[
              "Jusqu'à 10 membres",
              "Suivi collaboratif",
              "Analyses d'équipe",
              "Support dédié"
            ]}
            buttonText="Contactez-nous"
            onClick={() => handleButtonClick("/contact")}
            highlight={false}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
