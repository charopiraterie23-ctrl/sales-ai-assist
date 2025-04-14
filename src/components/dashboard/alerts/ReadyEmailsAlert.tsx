
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface ReadyEmailsAlertProps {
  emailCount: number;
}

const ReadyEmailsAlert = ({ emailCount }: ReadyEmailsAlertProps) => {
  const navigate = useNavigate();
  
  if (emailCount <= 0) return null;
  
  return (
    <Alert variant="default" className="bg-blue-50 border-l-4 border-l-blue-500">
      <div className="flex items-start">
        <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
        <div className="flex-1">
          <AlertDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h4 className="text-sm font-medium mb-1">{emailCount} relance{emailCount > 1 ? 's' : ''} prête{emailCount > 1 ? 's' : ''} à l'envoi</h4>
              <p className="text-sm text-gray-600">Vos emails IA sont générés et prêts à être envoyés.</p>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md"
              onClick={() => navigate('/emails')}
            >
              Envoyer maintenant
            </Button>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default ReadyEmailsAlert;
