
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
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <LinkIcon className="mr-2" /> Intégrations
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span>Gmail</span>
          {connectedAccounts.some(a => a.provider === 'gmail') ? (
            <Button variant="destructive" size="sm" onClick={() => handleEmailDisconnect('gmail')}>
              Déconnecter
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => handleEmailConnect('gmail')}>
              Connecter
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span>Outlook</span>
          {connectedAccounts.some(a => a.provider === 'outlook') ? (
            <Button variant="destructive" size="sm" onClick={() => handleEmailDisconnect('outlook')}>
              Déconnecter
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => handleEmailConnect('outlook')}>
              Connecter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSection;
