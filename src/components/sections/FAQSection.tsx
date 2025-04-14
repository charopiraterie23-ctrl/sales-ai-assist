
import React from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { HelpCircle, DollarSign, FileAudio, Shield, Link } from "lucide-react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  icon: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    question: "Quels sont les tarifs et les niveaux d'abonnement ?",
    answer: (
      <div className="space-y-2">
        <p>
          Nous proposons trois niveaux d'abonnement :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Free</strong> : Gratuit avec jusqu'à 3 appels par mois et résumés uniquement</li>
          <li><strong>Pro</strong> : 19$ par mois avec appels et emails illimités, connexions Gmail/Outlook et plus</li>
          <li><strong>Équipe</strong> : 199$ par mois pour jusqu'à 10 membres, suivi collaboratif et support dédié</li>
        </ul>
        <p>Vous pouvez essayer notre solution gratuitement avant de passer à un plan payant.</p>
      </div>
    ),
    icon: <DollarSign className="w-5 h-5 text-blue-500" />
  },
  {
    question: "Comment fonctionne la transcription et l'analyse des appels ?",
    answer: (
      <div className="space-y-2">
        <p>
          Notre technologie utilise l'intelligence artificielle avancée pour transcrire vos appels en temps réel ou à partir d'enregistrements.
        </p>
        <p>Le processus se déroule en trois étapes :</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Transcription précise de la conversation</li>
          <li>Analyse du contenu pour identifier les points clés et les intentions</li>
          <li>Génération de résumés structurés et d'actions à suivre</li>
        </ol>
        <p>Notre système s'améliore continuellement grâce au machine learning pour offrir des résultats de plus en plus pertinents.</p>
      </div>
    ),
    icon: <FileAudio className="w-5 h-5 text-blue-500" />
  },
  {
    question: "Comment mes données sont-elles protégées ?",
    answer: (
      <div className="space-y-2">
        <p>
          La confidentialité et la sécurité sont au cœur de notre service :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Toutes les données sont chiffrées en transit et au repos</li>
          <li>Nous ne partageons jamais vos données avec des tiers sans votre consentement explicite</li>
          <li>Conformité totale avec le RGPD et autres réglementations sur la protection des données</li>
          <li>Possibilité de supprimer définitivement vos données à tout moment</li>
        </ul>
        <p>Nos serveurs sont hébergés dans des centres de données sécurisés en Europe.</p>
      </div>
    ),
    icon: <Shield className="w-5 h-5 text-blue-500" />
  },
  {
    question: "Quelles intégrations sont disponibles avec d'autres outils ?",
    answer: (
      <div className="space-y-2">
        <p>
          Nexentry s'intègre facilement avec votre écosystème existant :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>CRM : Salesforce, HubSpot, Pipedrive</li>
          <li>Messagerie : Gmail, Outlook, Microsoft Teams</li>
          <li>Outils collaboratifs : Slack, Notion, Trello</li>
          <li>Automatisation : Zapier, Make (Integromat)</li>
        </ul>
        <p>
          Vous pouvez également accéder à notre API pour des intégrations personnalisées.
          Notre équipe peut vous aider à configurer ces intégrations selon vos besoins spécifiques.
        </p>
      </div>
    ),
    icon: <Link className="w-5 h-5 text-blue-500" />
  },
  {
    question: "Dois-je installer un logiciel spécifique pour utiliser nexentry ?",
    answer: (
      <p>
        Non, nexentry est une solution 100% basée sur le web. Vous n'avez besoin que d'un navigateur et d'une connexion internet pour accéder à toutes nos fonctionnalités. Aucune installation ou configuration complexe n'est nécessaire.
      </p>
    ),
    icon: <HelpCircle className="w-5 h-5 text-blue-500" />
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur nexentry
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-gray-50">
                <div className="flex items-center gap-3 text-left">
                  {item.icon}
                  <span className="font-medium text-gray-900">{item.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 py-4 text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
