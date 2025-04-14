
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Send, Loader2, Check, X, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Email } from '@/types/dashboardTypes';
import { sendEmail } from '@/api/emailApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useEmailConnection } from '@/hooks/useEmailConnection';
import { Badge } from '@/components/ui/badge';

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
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const { 
    connectEmail, 
    disconnectEmail, 
    connectedAccounts, 
    isLoading: isLoadingAccounts,
    refreshAccounts
  } = useEmailConnection();

  // Si isEmailConnected est false mais que nous avons des comptes connectés, mettre à jour
  useEffect(() => {
    if (!isEmailConnected && connectedAccounts.length > 0) {
      // Ce cas ne devrait pas arriver, mais au cas où
      if (onRefresh) onRefresh();
    }
  }, [isEmailConnected, connectedAccounts, onRefresh]);

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

  const handleDisconnectAccount = async (provider: 'gmail' | 'outlook') => {
    const success = await disconnectEmail(provider);
    if (success && onRefresh) {
      await onRefresh();
    }
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
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Emails prêts à l'envoi</h3>
          {isEmailConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConnectDialog(true)}
            >
              Gérer les comptes email
            </Button>
          )}
        </div>
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
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button 
                className="flex-1"
                onClick={() => connectEmail('gmail')}
              >
                <Mail className="h-4 w-4 mr-2" /> Connecter Gmail
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => connectEmail('outlook')}
              >
                <Mail className="h-4 w-4 mr-2" /> Connecter Outlook
              </Button>
            </div>
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

      {/* Dialog de gestion des comptes email */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Gérer vos comptes email</DialogTitle>
            <DialogDescription>
              Connectez ou déconnectez vos comptes email pour l'envoi direct depuis nexentry
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {isLoadingAccounts ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Comptes connectés</h4>
                  
                  {connectedAccounts.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucun compte email connecté</p>
                  ) : (
                    <div className="space-y-2">
                      {connectedAccounts.map((account) => (
                        <div key={account.provider} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center space-x-3">
                            <Check className="h-5 w-5 text-green-500" />
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">
                                  {account.provider === 'gmail' ? 'Gmail' : 'Outlook'}
                                </span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {account.provider}
                                </Badge>
                              </div>
                              {account.email && (
                                <p className="text-sm text-gray-500">{account.email}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDisconnectAccount(account.provider)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Connecter un nouveau compte</h4>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant={connectedAccounts.some(a => a.provider === 'gmail') ? 'outline' : 'default'}
                      onClick={() => connectEmail('gmail')}
                      disabled={connectedAccounts.some(a => a.provider === 'gmail')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {connectedAccounts.some(a => a.provider === 'gmail') 
                        ? 'Gmail déjà connecté' 
                        : 'Connecter Gmail'}
                    </Button>
                    <Button
                      variant={connectedAccounts.some(a => a.provider === 'outlook') ? 'outline' : 'default'}
                      onClick={() => connectEmail('outlook')}
                      disabled={connectedAccounts.some(a => a.provider === 'outlook')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {connectedAccounts.some(a => a.provider === 'outlook') 
                        ? 'Outlook déjà connecté' 
                        : 'Connecter Outlook'}
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            <div className="pt-2 border-t">
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Documentation API OAuth
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ReadyEmailsCard;
