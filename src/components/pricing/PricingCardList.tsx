
import React from 'react';
import PricingCard from '@/components/pricing/PricingCard';

interface Plan {
  id: string;
  name: string;
  priceMonthly: number | null;
  usersIncluded: number | null;
  features: string[];
  ctaLabel: string;
  stripeProductId: string;
  hasTrial?: boolean;
}

interface PricingCardListProps {
  plans: Plan[];
  onSelectPlan: (plan: Plan) => void;
  isLoading: string | null;
}

const PricingCardList: React.FC<PricingCardListProps> = ({ 
  plans, 
  onSelectPlan,
  isLoading 
}) => {
  // Filter out the "Essai Pro" plan for display
  const displayPlans = plans.filter(plan => plan.name !== 'Essai Pro');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {displayPlans.map((plan) => (
        <PricingCard
          key={plan.id}
          title={plan.name === 'Team' ? `Team (≤ ${plan.usersIncluded} users)` : plan.name}
          price={plan.priceMonthly !== null ? `${plan.priceMonthly} $` : 'Sur mesure'}
          description={plan.name === 'Pro' ? '/ mois / utilisateur' : (plan.name === 'Entreprise' ? '' : '/ mois')}
          features={plan.features}
          buttonText={plan.ctaLabel}
          onClick={() => onSelectPlan(plan)}
          isLoading={isLoading === plan.id}
          badge={plan.hasTrial ? 'Essai gratuit 7 j' : undefined}
          highlight={plan.name === 'Pro'}
        />
      ))}
    </div>
  );
};

export default PricingCardList;
