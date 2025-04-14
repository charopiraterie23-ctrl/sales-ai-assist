
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BillingSection = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CreditCard className="mr-2" /> Plan et facturation
      </h2>
      <div className="space-y-4">
        <p>Plan actuel : Gratuit</p>
        <p>Appels traités ce mois : 7/15</p>
        <p>Prochaine facturation : 13 mai 2025</p>
        <Button variant="outline" className="w-full">
          Gérer mon abonnement
        </Button>
      </div>
    </div>
  );
};

export default BillingSection;
