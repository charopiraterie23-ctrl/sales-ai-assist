
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const SecuritySection = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Lock className="mr-2" /> Sécurité
      </h2>
      <Button variant="outline" className="w-full mb-4">
        Réinitialiser mot de passe
      </Button>
    </div>
  );
};

export default SecuritySection;
