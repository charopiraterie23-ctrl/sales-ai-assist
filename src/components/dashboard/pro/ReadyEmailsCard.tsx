
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Email } from '@/types/dashboardTypes';
import { sendEmail } from '@/api/emailApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ReadyEmailsCardProps {
  isEmailConnected: boolean;
  isLoading?: boolean;
  emails?: Email[];
  onConnectEmail?: () => void;
  onRefresh?: () => Promise<void>;
}

const ReadyEmailsCard = ({ 
  isEmailConnected, 
  isLoading = false, 
  emails = [],
  onConnectEmail,
  onRefresh
}: ReadyEmailsCardProps) => {
  const { toast } = useToast();
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailPreview, setEmailPreview] = useState<Email | null>(null);

  const handleSendEmail = async (email: Email) => {
    setSendingEmailId(email.id);
    
    try {
      const result = await sendEmail(email.id);
      
      if (result.success) {
        toast({
          title: "Email envoyé",
          description: `L'email a été envoyé avec succès à ${email.to}`,
        });
        
        // Rafraîchir les données
        if (onRefresh) await onRefresh();
      } else {
        toast({
          title: "Erreur",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email",
        variant: "destructive",
      });
    } finally {
      setSendingEmailId(null);
    }
  };
  
  const handlePreviewEmail = (email: Email) => {
    setEmailPreview(email);
  };
  
  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Emails prêts à l'envoi</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Emails prêts à l'envoi</h3>
      </CardHeader>
      <CardContent>
        {isEmailConnected ? (
          emails && emails.length > 0 ? (
            <div className="space-y-4">
              {emails.map((email) => (
                <div key={email.id} className="border rounded-lg p-4">
                  <div className="font-medium mb-1">À: {email.to}</div>
                  <div className="text-sm font-medium mb-1">Sujet: {email.subject}</div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {email.body.substring(0, 100)}...
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSendEmail(email)}
                      disabled={sendingEmailId === email.id}
                    >
                      {sendingEmailId === email.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" /> Envoyer maintenant
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreviewEmail(email)}
                    >
                      Aperçu
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Mail className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <h4 className="font-medium mb-1">Aucun email à envoyer</h4>
              <p className="text-sm text-gray-600 mb-3">
                Tous vos emails de suivi ont été envoyés. Bravo !
              </p>
            </div>
          )
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <Mail className="h-10 w-10 mx-auto mb-2 text-nexentry-blue opacity-70" />
            <h4 className="font-medium mb-1">Connectez votre compte email</h4>
            <p className="text-sm text-gray-600 mb-3">
              Activez l'envoi direct depuis nexentry en connectant votre compte Gmail ou Outlook
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onConnectEmail}
            >
              Connecter mon compte email
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Dialog d'aperçu d'email */}
      <Dialog open={emailPreview !== null} onOpenChange={(open) => !open && setEmailPreview(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu de l'email</DialogTitle>
            <DialogDescription>
              Visualisez votre email avant de l'envoyer
            </DialogDescription>
          </DialogHeader>
          
          {emailPreview && (
            <div className="space-y-4 mt-4">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">À:</p>
                <p className="font-medium">{emailPreview.to}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Sujet:</p>
                <p className="font-medium">{emailPreview.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Message:</p>
                <div className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  {emailPreview.body}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setEmailPreview(null)}
                >
                  Fermer
                </Button>
                <Button 
                  onClick={() => {
                    handleSendEmail(emailPreview);
                    setEmailPreview(null);
                  }}
                  disabled={sendingEmailId === emailPreview.id}
                >
                  {sendingEmailId === emailPreview.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Envoyer maintenant
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ReadyEmailsCard;
