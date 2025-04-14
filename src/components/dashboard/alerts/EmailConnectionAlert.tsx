
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link, Check } from 'lucide-react';

interface EmailConnectionAlertProps {
  isEmailConnected: boolean;
  connectedEmail?: string;
  connectEmail: (provider: 'gmail' | 'outlook') => Promise<void>;
}

const EmailConnectionAlert = ({ 
  isEmailConnected, 
  connectedEmail,
  connectEmail 
}: EmailConnectionAlertProps) => {
  if (isEmailConnected) {
    return (
      <Alert variant="default" className="bg-green-50 border-l-4 border-l-green-500">
        <div className="flex items-center">
          <Check className="h-5 w-5 text-green-500 mr-3" />
          <AlertDescription className="flex justify-between items-center w-full">
            <span className="text-sm">Connecté à {connectedEmail}</span>
          </AlertDescription>
        </div>
      </Alert>
    );
  }
  
  return (
    <Alert variant="default" className="bg-gray-50 border-l-4 border-l-gray-400">
      <div className="flex items-start">
        <Link className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
        <div className="flex-1">
          <AlertDescription className="flex flex-col gap-3">
            <div>
              <h4 className="text-sm font-medium mb-1">Activez l'envoi direct de vos relances</h4>
              <p className="text-sm text-gray-600">Connectez votre compte Gmail ou Outlook pour envoyer vos relances directement depuis l'app.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                className="border border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                onClick={() => connectEmail('gmail')}
              >
                Connecter Gmail
              </Button>
              <Button 
                variant="outline"
                className="border border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                onClick={() => connectEmail('outlook')}
              >
                Connecter Outlook
              </Button>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default EmailConnectionAlert;
