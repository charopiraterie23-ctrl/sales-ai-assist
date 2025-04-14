
import React from "react";
import PricingCard from "@/components/pricing/PricingCard";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Des plans adaptés à vos appels</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Testez gratuitement. Passez à Pro quand vous êtes prêt.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            title="Free"
            price="0$"
            description="Pour tester l'expérience"
            features={[
              "Jusqu'à 3 appels/mois",
              "Résumés uniquement",
              "CRM de base"
            ]}
            buttonText="Commencer gratuitement"
            buttonLink="/register"
            highlight={false}
          />
          <PricingCard
            title="Pro"
            price="19$"
            badge="Le plus populaire"
            description="Pour les professionnels"
            features={[
              "Appels illimités",
              "Emails illimités",
              "Connexion Gmail/Outlook",
              "Support prioritaire",
              "CRM complet"
            ]}
            buttonText="Passer au Pro"
            buttonLink="/register"
            highlight={true}
          />
          <PricingCard
            title="Équipe"
            price="199$"
            description="Pour les équipes"
            features={[
              "Jusqu'à 10 membres",
              "Suivi collaboratif des clients",
              "Envoi d'emails groupés",
              "Support dédié"
            ]}
            buttonText="Contactez-nous"
            buttonLink="/contact"
            highlight={false}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
