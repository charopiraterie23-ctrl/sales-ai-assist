
import React from 'react';
import { LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmailAccount } from '@/hooks/email/types';

interface IntegrationsSectionProps {
  connectedAccounts: EmailAccount[];
  handleEmailConnect: (provider: 'gmail' | 'outlook') => void;
  handleEmailDisconnect: (provider: 'gmail' | 'outlook') => Promise<boolean>;
}

const IntegrationsSection = ({
  connectedAccounts,
  handleEmailConnect,
  handleEmailDisconnect
}: IntegrationsSectionProps) => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/40 rounded-xl p-6 text-white">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <LinkIcon className="mr-2 text-gray-400" /> Intégrations
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Gmail</span>
          {connectedAccounts.some(a => a.provider === 'gmail') ? (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleEmailDisconnect('gmail')}
              className="bg-red-900/60 hover:bg-red-800 text-white"
            >
              Déconnecter
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEmailConnect('gmail')}
              className="bg-gray-800 text-white border-gray-700 hover:bg-nexentry-blue"
            >
              Connecter
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Outlook</span>
          {connectedAccounts.some(a => a.provider === 'outlook') ? (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleEmailDisconnect('outlook')}
              className="bg-red-900/60 hover:bg-red-800 text-white"
            >
              Déconnecter
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEmailConnect('outlook')}
              className="bg-gray-800 text-white border-gray-700 hover:bg-nexentry-blue"
            >
              Connecter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSection;
