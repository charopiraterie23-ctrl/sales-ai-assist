
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const SecuritySection = () => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/40 rounded-xl p-6 text-white">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Lock className="mr-2 text-gray-400" /> Sécurité
      </h2>
      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full bg-gray-800 text-white border-gray-700 hover:bg-nexentry-blue hover:text-white"
        >
          Réinitialiser mot de passe
        </Button>
      </div>
    </div>
  );
};

export default SecuritySection;
