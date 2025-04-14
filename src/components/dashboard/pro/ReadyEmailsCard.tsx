
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Send } from 'lucide-react';

interface ReadyEmailsCardProps {
  isEmailConnected: boolean;
}

const ReadyEmailsCard = ({ isEmailConnected }: ReadyEmailsCardProps) => {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Emails prêts à l'envoi</h3>
      </CardHeader>
      <CardContent>
        {isEmailConnected ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="font-medium mb-1">À: Sophie Martin</div>
              <div className="text-sm font-medium mb-1">Sujet: Suivi de notre appel - Documentation CRM</div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                Bonjour Sophie, Suite à notre échange d'aujourd'hui concernant l'implémentation du CRM...
              </p>
              <Button size="sm" className="w-full">
                <Send className="h-4 w-4 mr-2" /> Envoyer maintenant
              </Button>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="font-medium mb-1">À: Marc Dubois</div>
              <div className="text-sm font-medium mb-1">Sujet: Options de renouvellement - Offres Pro et Premium</div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                Bonjour Marc, Pour faire suite à notre discussion concernant le renouvellement de votre contrat...
              </p>
              <Button size="sm" className="w-full">
                <Send className="h-4 w-4 mr-2" /> Envoyer maintenant
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <Mail className="h-10 w-10 mx-auto mb-2 text-nexentry-blue opacity-70" />
            <h4 className="font-medium mb-1">Connectez votre compte email</h4>
            <p className="text-sm text-gray-600 mb-3">
              Activez l'envoi direct depuis nexentry en connectant votre compte Gmail ou Outlook
            </p>
            <Button variant="outline" className="w-full">
              Connecter mon compte email
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReadyEmailsCard;
