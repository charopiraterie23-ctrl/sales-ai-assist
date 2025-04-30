
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Email } from '@/types/dashboardTypes';

interface DraftEmailsCardProps {
  isEmailConnected: boolean;
  isLoading: boolean;
  emails?: Email[];
  onConnectEmail: () => void;
  onSendAll: () => void;
}

const DraftEmailsCard: React.FC<DraftEmailsCardProps> = ({
  isEmailConnected,
  isLoading,
  emails = [],
  onConnectEmail,
  onSendAll
}) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="pt-4 pb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!isEmailConnected) {
    return (
      <Card>
        <CardContent className="pt-4 pb-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
            <Mail className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Connectez votre email</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Pour envoyer des résumés et suivis automatisés
          </p>
          <Button onClick={onConnectEmail}>
            Connecter mon email
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (emails.length === 0) {
    return null; // Ne pas afficher la carte s'il n'y a pas d'emails en attente
  }
  
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">Brouillons à envoyer</h3>
          <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {emails.length}
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          {emails.slice(0, 3).map((email) => (
            <div 
              key={email.id} 
              className="p-2 border border-gray-100 dark:border-gray-800 rounded-lg flex justify-between items-center"
            >
              <div className="truncate flex-1">
                <div className="text-sm font-medium">{email.to}</div>
                <div className="text-xs text-gray-500 truncate">{email.subject}</div>
              </div>
              <Button variant="outline" size="sm">Voir</Button>
            </div>
          ))}
          
          {emails.length > 3 && (
            <div className="text-sm text-center text-gray-500">
              + {emails.length - 3} autres brouillons
            </div>
          )}
        </div>
        
        <Button className="w-full" onClick={onSendAll}>
          <Mail className="mr-2 h-4 w-4" /> Tout envoyer
        </Button>
      </CardContent>
    </Card>
  );
};

export default DraftEmailsCard;
