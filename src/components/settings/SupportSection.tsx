
import React from 'react';
import { HelpCircle } from 'lucide-react';

const SupportSection = () => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/40 rounded-xl p-6 text-white">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <HelpCircle className="mr-2 text-gray-400" /> Support / Legal
      </h2>
      <div className="space-y-4">
        <a href="#" className="block text-gray-300 hover:text-nexentry-blue transition-colors hover:underline">FAQ</a>
        <a href="#" className="block text-gray-300 hover:text-nexentry-blue transition-colors hover:underline">Politique de confidentialité</a>
        <a href="#" className="block text-gray-300 hover:text-nexentry-blue transition-colors hover:underline">Conditions d'utilisation</a>
        <a href="mailto:contact@nexentry.io" className="block text-gray-300 hover:text-nexentry-blue transition-colors hover:underline">
          Contact support
        </a>
      </div>
    </div>
  );
};

export default SupportSection;
