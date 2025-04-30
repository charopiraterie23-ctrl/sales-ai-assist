
import React from 'react';
import { HelpCircle } from 'lucide-react';

const SupportSection = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <HelpCircle className="mr-2" /> Support / Legal
      </h2>
      <div className="space-y-4">
        <a href="#" className="block hover:underline">FAQ</a>
        <a href="#" className="block hover:underline">Politique de confidentialité</a>
        <a href="#" className="block hover:underline">Conditions d'utilisation</a>
        <a href="mailto:contact@nexentry.io" className="block hover:underline">
          Contact support
        </a>
      </div>
    </div>
  );
};

export default SupportSection;
