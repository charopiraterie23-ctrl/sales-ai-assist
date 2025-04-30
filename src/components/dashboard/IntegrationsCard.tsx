
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, Check, X } from 'lucide-react';

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
  // Hide the card if both email and SMS are connected
  if (isEmailConnected && isSMSConnected) return null;
  
  return (
    <Card className="bg-[#F5F7FA] dark:bg-gray-800 border-none shadow-sm animate-fade-in rounded-2xl">
      <CardContent className="pt-4 pb-4 px-4 md:px-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-full bg-white dark:bg-gray-700 p-2 w-10 h-10 flex items-center justify-center">
            <Link size={24} className="text-[#2166F0]" />
          </div>
          <h3 className="font-semibold">Intégrations</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <div 
            className={`flex items-center rounded-full py-1 px-3 text-sm ${
              isEmailConnected 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600'
            }`}
            onClick={isEmailConnected ? undefined : onConnectEmail}
            role={isEmailConnected ? undefined : "button"}
          >
            {isEmailConnected ? (
              <>
                <Check size={16} className="mr-1 text-green-500" />
                Gmail
              </>
            ) : (
              <>
                <span className="mr-1">Gmail</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onConnectEmail}>
                  <span className="sr-only">Connecter Gmail</span>
                  +
                </Button>
              </>
            )}
          </div>
          
          <div 
            className={`flex items-center rounded-full py-1 px-3 text-sm ${
              isSMSConnected 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600'
            }`}
            onClick={isSMSConnected ? undefined : onConnectSMS}
            role={isSMSConnected ? undefined : "button"}
          >
            {isSMSConnected ? (
              <>
                <Check size={16} className="mr-1 text-green-500" />
                SMS
              </>
            ) : (
              <>
                <span className="mr-1">SMS</span>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onConnectSMS}>
                  <span className="sr-only">Connecter SMS</span>
                  +
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsCard;
