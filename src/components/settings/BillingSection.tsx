
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BillingSection = () => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/40 rounded-xl p-6 text-white">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <CreditCard className="mr-2 text-gray-400" /> Plan et facturation
      </h2>
      <div className="space-y-4">
        <p className="text-gray-300">Plan actuel : <span className="text-white">Gratuit</span></p>
        <p className="text-gray-300">Appels traités ce mois : <span className="text-white">7/15</span></p>
        <p className="text-gray-300">Prochaine facturation : <span className="text-white">13 mai 2025</span></p>
        <Button 
          variant="outline" 
          className="w-full bg-gray-800 text-white border-gray-700 hover:bg-nexentry-blue"
        >
          Gérer mon abonnement
        </Button>
      </div>
    </div>
  );
};

export default BillingSection;
