
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';

interface IntegrationsCardProps {
  isEmailConnected: boolean;
  isSMSConnected: boolean;
  onConnectEmail: () => void;
  onConnectSMS: () => void;
}

const IntegrationsCard: React.FC<IntegrationsCardProps> = ({
  isEmailConnected,
  isSMSConnected,
  onConnectEmail,
  onConnectSMS
}) => {
  if (isEmailConnected && isSMSConnected) return null;
  
  return (
    <Card className="bg-[#F5F7FA] dark:bg-gray-800 border-none shadow-sm animate-fade-in">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-full bg-white dark:bg-gray-700 p-2 w-10 h-10 flex items-center justify-center">
            <Link size={20} className="text-[#2166F0]" />
          </div>
          <h3 className="font-semibold">Intégrations</h3>
        </div>
        
        <div className="flex gap-2 mt-3">
          {!isEmailConnected && (
            <Button 
              variant="outline" 
              className="flex-1 bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
              onClick={onConnectEmail}
            >
              Connecter e-mail
            </Button>
          )}
          
          {!isSMSConnected && (
            <Button 
              variant="outline" 
              className="flex-1 bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
              onClick={onConnectSMS}
            >
              Connecter n° SMS
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsCard;
