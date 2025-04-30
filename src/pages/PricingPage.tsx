
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import HeaderMinimal from '@/components/pricing/HeaderMinimal';
import PricingCardList from '@/components/pricing/PricingCardList';
import FooterMinimal from '@/components/pricing/FooterMinimal';

const plans = [
  {
    id: '1',
    name: 'Essai Pro',
    priceMonthly: 0,
    usersIncluded: 1,
    features: ['Accès complet Pro 7 j', 'Sans carte bancaire'],
    ctaLabel: "Commencer l'essai",
    stripeProductId: 'prod_trial_pro',
  },
  {
    id: '2',
    name: 'Pro',
    priceMonthly: 19,
    usersIncluded: 1,
    features: ['Résumé IA illimité', 'Emails/SMS auto', 'Mini-CRM'],
    ctaLabel: 'Passer au Pro',
    stripeProductId: 'prod_pro',
    hasTrial: true
  },
  {
    id: '3',
    name: 'Team',
    priceMonthly: 199,
    usersIncluded: 15,
    features: ['Toutes les fonctions Pro', '15 utilisateurs inclus', 'Tableau admin'],
    ctaLabel: 'Démarrer Team',
    stripeProductId: 'prod_team',
  }
];

const startCheckout = async (plan: typeof plans[0]) => {
  try {
    // In a real implementation, this would call a serverless function
    console.log(`Starting checkout for plan: ${plan.name}`);
    // Placeholder for the actual checkout logic
    // const response = await supabase.functions.invoke('startCheckout', { body: { planId: plan.id } });
    // window.location.href = response.data.url;
  } catch (error) {
    console.error("Error starting checkout:", error);
  }
};

const PricingPage = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: typeof plans[0]) => {
    setIsLoading(plan.id);
    await startCheckout(plan);
    setIsLoading(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeaderMinimal />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Tarification simple et transparente
          </h1>
          <p className="text-lg text-gray-600">
            Testez tout gratuitement pendant 7 jours, aucune carte requise.
          </p>
        </div>

        <PricingCardList plans={plans} onSelectPlan={handleCheckout} isLoading={isLoading} />

        <div className="mt-16 mb-8">
          <h2 className="text-xl font-bold text-center mb-6">Questions fréquentes</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="q1">
              <AccordionTrigger className="text-left">
                Comment fonctionne l'essai gratuit de 7 jours ?
              </AccordionTrigger>
              <AccordionContent>
                Vous bénéficiez d'un accès complet aux fonctionnalités Pro pendant 7 jours sans avoir à entrer de carte bancaire. À la fin de la période d'essai, vous pouvez choisir de passer au forfait payant ou votre compte reviendra automatiquement à la version gratuite.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-left">
                Puis-je annuler mon abonnement à tout moment ?
              </AccordionTrigger>
              <AccordionContent>
                Oui, vous pouvez annuler votre abonnement à tout moment depuis les paramètres de votre compte. Votre abonnement restera actif jusqu'à la fin de la période facturée.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-left">
                Quelles sont les méthodes de paiement acceptées ?
              </AccordionTrigger>
              <AccordionContent>
                Nous acceptons les principales cartes de crédit (Visa, Mastercard, American Express) ainsi que les paiements via PayPal.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center md:hidden shadow-lg">
        <Button className="w-full bg-[#2166F0] hover:bg-blue-700" onClick={() => handleCheckout(plans[1])}>
          14 jours d'essai gratuit — Sans engagement
        </Button>
      </div>

      <FooterMinimal />
    </div>
  );
};

export default PricingPage;
