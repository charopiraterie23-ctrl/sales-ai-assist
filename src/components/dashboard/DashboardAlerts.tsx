
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail, BellRing, CheckCircle } from 'lucide-react';
import { DashboardData } from '@/hooks/useDashboardData';
import { useState, useEffect } from 'react';

interface DashboardAlertsProps {
  dashboardData: DashboardData;
  userPlan: string;
  connectEmail: (provider: 'gmail' | 'outlook') => Promise<void>;
  emailSynced: boolean | undefined;
}

// Définir les priorités des alertes
const PRIORITY = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1
};

type Alert = {
  id: string;
  content: React.ReactNode;
  priority: number;
  variant: 'default' | 'destructive';
  className: string;
  icon: React.ReactNode;
};

const DashboardAlerts = ({ dashboardData, userPlan, connectEmail, emailSynced }: DashboardAlertsProps) => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [visible, setVisible] = useState(false);
  
  // Calculer le statut de limite d'appel
  const callsLimit = userPlan === 'pro' ? 100 : 3;
  const callsUsed = dashboardData.callsThisMonth?.total_calls || 0;
  const isNearLimit = userPlan === 'free' && callsUsed >= 2; // 2/3 pour le plan gratuit

  useEffect(() => {
    const newAlerts: Alert[] = [];

    // Alerte pour la limite d'appels presque atteinte (Priorité haute)
    if (isNearLimit) {
      newAlerts.push({
        id: 'call-limit',
        priority: PRIORITY.HIGH,
        variant: 'default',
        className: 'bg-yellow-50 border-yellow-200 animate-fade-in',
        icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
        content: (
          <AlertDescription className="flex justify-between items-center">
            <span>Vous approchez de votre limite d'appels mensuelle</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 border-yellow-300 hover:bg-yellow-100"
              onClick={() => navigate('/pricing')}
            >
              Passer au plan Pro
            </Button>
          </AlertDescription>
        )
      });
    }

    // Alerte pour les appels à suivre (Priorité haute)
    if (dashboardData.callsToFollow?.calls && dashboardData.callsToFollow.calls.length > 0) {
      newAlerts.push({
        id: 'calls-to-follow',
        priority: PRIORITY.HIGH,
        variant: 'default',
        className: 'bg-orange-50 border-orange-200 animate-fade-in',
        icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
        content: (
          <AlertDescription className="flex justify-between items-center">
            <span>{dashboardData.callsToFollow.calls.length} appel(s) sans relance client</span>
            <Button variant="outline" size="sm" className="ml-2 border-orange-300 hover:bg-orange-100">
              Relancer maintenant
            </Button>
          </AlertDescription>
        )
      });
    }

    // Alerte pour les emails prêts à l'envoi (Priorité moyenne)
    if (dashboardData.emailsToSend?.emails && dashboardData.emailsToSend.emails.length > 0) {
      newAlerts.push({
        id: 'emails-to-send',
        priority: PRIORITY.MEDIUM,
        variant: 'default',
        className: 'bg-blue-50 border-blue-200 animate-fade-in',
        icon: <Mail className="h-4 w-4 text-blue-500" />,
        content: (
          <AlertDescription className="flex justify-between items-center">
            <span>{dashboardData.emailsToSend.emails.length} relance(s) prête(s) à l'envoi</span>
            <Button variant="outline" size="sm" className="ml-2 border-blue-300 hover:bg-blue-100">
              Envoyer maintenant
            </Button>
          </AlertDescription>
        )
      });
    }

    // Alerte pour connecter un compte email (Priorité basse)
    if (!emailSynced) {
      newAlerts.push({
        id: 'connect-email',
        priority: PRIORITY.LOW,
        variant: 'default',
        className: 'bg-gray-50 border-gray-200 animate-fade-in',
        icon: <Mail className="h-4 w-4 text-gray-500" />,
        content: (
          <AlertDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span>Connectez votre compte email pour envoyer directement depuis nexentry.io</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => connectEmail('gmail')}
                className="border-gray-300 hover:bg-gray-100"
              >
                Connecter Gmail
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => connectEmail('outlook')}
                className="border-gray-300 hover:bg-gray-100"
              >
                Connecter Outlook
              </Button>
            </div>
          </AlertDescription>
        )
      });
    }

    // Trier les alertes par priorité (du plus haut au plus bas)
    const sortedAlerts = newAlerts.sort((a, b) => b.priority - a.priority);
    setAlerts(sortedAlerts);
    
    // Animation d'entrée pour les alertes
    setVisible(false);
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [dashboardData, userPlan, emailSynced, isNearLimit, navigate, connectEmail]);

  return (
    <div className={`space-y-2 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {alerts.map((alert) => (
        <Alert 
          key={alert.id} 
          variant={alert.variant} 
          className={`transition-all duration-300 ${alert.className}`}
        >
          {alert.icon}
          {alert.content}
        </Alert>
      ))}
    </div>
  );
};

export default DashboardAlerts;
