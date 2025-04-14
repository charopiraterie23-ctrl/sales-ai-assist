
import React from "react";
import { Mic, Mail, Users, Send } from "lucide-react";
import FeatureCard from "@/components/cards/FeatureCard";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vos tâches répétitives, automatisées.</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">L'IA vous aide là où vous perdez du temps.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Mic className="w-10 h-10 text-blue-600" />}
            title="Résumés IA instantanés"
            description="Transcription et résumé de chaque appel en quelques secondes."
          />
          <FeatureCard
            icon={<Mail className="w-10 h-10 text-blue-600" />}
            title="Relances emails personnalisées"
            description="Emails de suivi rédigés par l'IA basés sur la conversation."
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-blue-600" />}
            title="Gestion de clients simplifiée"
            description="Organisez tous vos prospects et clients au même endroit."
          />
          <FeatureCard
            icon={<Send className="w-10 h-10 text-blue-600" />}
            title="Envoi direct via Gmail / Outlook"
            description="Intégration avec votre compte email professionnel."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
