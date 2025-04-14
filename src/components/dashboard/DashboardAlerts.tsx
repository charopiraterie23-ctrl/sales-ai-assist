
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail } from 'lucide-react';
import { DashboardData } from '@/hooks/useDashboardData';

interface DashboardAlertsProps {
  dashboardData: DashboardData;
  userPlan: string;
  connectEmail: (provider: 'gmail' | 'outlook') => Promise<void>;
  emailSynced: boolean | undefined;
}

const DashboardAlerts = ({ dashboardData, userPlan, connectEmail, emailSynced }: DashboardAlertsProps) => {
  const navigate = useNavigate();
  
  // Calculer le statut de limite d'appel
  const callsLimit = userPlan === 'pro' ? 100 : 3;
  const callsUsed = dashboardData.callsThisMonth?.total_calls || 0;
  const isNearLimit = userPlan === 'free' && callsUsed >= 2; // 2/3 pour le plan gratuit

  return (
    <>
      {/* Alerte pour les appels à suivre */}
      {dashboardData.callsToFollow && dashboardData.callsToFollow.calls && dashboardData.callsToFollow.calls.length > 0 && (
        <Alert variant="default" className="bg-orange-50 border-orange-200">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="flex justify-between items-center">
            <span>{dashboardData.callsToFollow.calls.length} appel(s) sans relance client</span>
            <Button variant="outline" size="sm" className="ml-2">
              Relancer maintenant
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Alerte pour la limite d'appels presque atteinte */}
      {isNearLimit && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="flex justify-between items-center">
            <span>Vous approchez de votre limite d'appels mensuelle</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => navigate('/pricing')}
            >
              Passer au plan Pro
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Alerte pour les emails prêts à l'envoi */}
      {dashboardData.emailsToSend && dashboardData.emailsToSend.emails && dashboardData.emailsToSend.emails.length > 0 && (
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Mail className="h-4 w-4 text-blue-500" />
          <AlertDescription className="flex justify-between items-center">
            <span>{dashboardData.emailsToSend.emails.length} relance(s) prête(s) à l'envoi</span>
            <Button variant="outline" size="sm" className="ml-2">
              Envoyer maintenant
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Alerte pour connecter un compte email */}
      {!emailSynced && (
        <Alert variant="default" className="bg-gray-50 border-gray-200">
          <Mail className="h-4 w-4 text-gray-500" />
          <AlertDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span>Connectez votre compte email pour envoyer directement depuis nexentry.io</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => connectEmail('gmail')}
              >
                Connecter Gmail
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => connectEmail('outlook')}
              >
                Connecter Outlook
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DashboardAlerts;
