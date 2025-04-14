
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Send, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReadyEmailsCardProps {
  isEmailConnected: boolean;
  readyEmails: number;
  emails?: {
    id: string;
    to: string;
    subject: string;
    body: string;
  }[];
}

const ReadyEmailsCard = ({ isEmailConnected, readyEmails, emails = [] }: ReadyEmailsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="animate-slide-up border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Relances prêtes à l'envoi</h3>
        </div>
      </CardHeader>
      <CardContent>
        {isEmailConnected && readyEmails > 0 ? (
          <div className="space-y-4">
            {emails.length > 0 ? (
              emails.slice(0, 2).map((email, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="font-medium mb-1">À: {email.to}</div>
                  <div className="text-sm font-medium mb-1">Sujet: {email.subject}</div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {email.body.substring(0, 120)}...
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    <Send className="h-4 w-4 mr-2" /> Envoyer maintenant
                  </Button>
                </div>
              ))
            ) : (
              <div className="border rounded-lg p-4">
                <div className="font-medium mb-1">Vous avez {readyEmails} email{readyEmails > 1 ? 's' : ''} prêt{readyEmails > 1 ? 's' : ''} à l'envoi</div>
                <Button 
                  onClick={() => navigate('/emails')}
                  className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Send className="h-4 w-4 mr-2" /> Voir tous les emails
                </Button>
              </div>
            )}
          </div>
        ) : !isEmailConnected ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <Mail className="h-10 w-10 mx-auto mb-2 text-blue-500 opacity-70" />
            <h4 className="font-medium mb-1">Connectez votre compte email</h4>
            <p className="text-sm text-gray-600 mb-3">
              Activez l'envoi direct depuis nexentry en connectant votre compte Gmail ou Outlook
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                Connecter Gmail
              </Button>
              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                Connecter Outlook
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <Check className="h-10 w-10 mx-auto mb-2 text-green-500" />
            <h4 className="font-medium mb-1">Email connecté !</h4>
            <p className="text-sm text-gray-600 mb-3">
              Vous n'avez actuellement aucun email prêt à l'envoi.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReadyEmailsCard;
