
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import DashboardWelcomeHeader from '@/components/dashboard/DashboardWelcomeHeader';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import FreeDashboardContent from '@/components/dashboard/FreeDashboardContent';
import ProDashboardContent from '@/components/dashboard/ProDashboardContent';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Mail } from 'lucide-react';

interface CallsThisMonth {
  total_calls: number;
}

interface Email {
  id: string;
  to: string;
  subject: string;
  body: string;
  summary_id: string;
}

interface EmailsToSend {
  emails: Email[];
}

interface Call {
  id: string;
  client_id: string;
  created_at: string;
}

interface CallsToFollow {
  calls: Call[];
}

const DashboardPage = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tipIndex, setTipIndex] = useState(0);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [hasRecentCall, setHasRecentCall] = useState(false);
  
  // États pour les nouvelles fonctionnalités
  const [callsThisMonth, setCallsThisMonth] = useState<CallsThisMonth | null>(null);
  const [emailsToSend, setEmailsToSend] = useState<EmailsToSend | null>(null);
  const [callsToFollow, setCallsToFollow] = useState<CallsToFollow | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Explicitement normaliser le plan pour éviter les problèmes de casse
  const userPlan = profile?.plan?.toLowerCase() || 'free';

  // Vérifier si le paramètre email_connected est présent dans l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailConnected = urlParams.get('email_connected');
    const provider = urlParams.get('provider');
    
    if (emailConnected === 'true' && provider) {
      toast({
        title: "Compte email connecté !",
        description: `Votre compte ${provider === 'gmail' ? 'Gmail' : 'Outlook'} a été connecté avec succès.`,
        duration: 5000,
      });
      
      // Nettoyer l'URL après affichage du toast
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, toast]);

  useEffect(() => {
    // Pour débugger
    console.log("Current user profile:", profile);
    console.log("User plan detected:", userPlan);
    
    // Rotation des astuces toutes les 10 secondes
    const interval = setInterval(() => {
      setTipIndex((prev) => {
        const tipsLength = userPlan === 'pro' ? 4 : 4; // Pourrait être dynamique selon la longueur des tableaux d'astuces
        return (prev + 1) % tipsLength;
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [userPlan, profile]);

  // Chargement des données du dashboard
  useEffect(() => {
    if (user?.id) {
      const fetchDashboardData = async () => {
        setIsLoadingData(true);
        try {
          // 1. Récupérer le nombre d'appels ce mois-ci
          const { data: callsData, error: callsError } = await supabase
            .rpc('get_calls_this_month', { user_uuid: user.id });
          
          if (callsError) throw callsError;
          setCallsThisMonth(callsData as CallsThisMonth);
          
          // 2. Récupérer les emails prêts à l'envoi
          const { data: emailsData, error: emailsError } = await supabase
            .rpc('get_emails_ready_to_send', { user_uuid: user.id });
          
          if (emailsError) throw emailsError;
          setEmailsToSend(emailsData as EmailsToSend);
          
          // 3. Récupérer les appels à relancer aujourd'hui
          const { data: followUpData, error: followUpError } = await supabase
            .rpc('get_calls_to_follow_up_today', { user_uuid: user.id });
          
          if (followUpError) throw followUpError;
          setCallsToFollow(followUpData as CallsToFollow);
          
        } catch (error) {
          console.error('Erreur lors du chargement des données du dashboard:', error);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger certaines données du dashboard.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingData(false);
        }
      };
      
      fetchDashboardData();
    }
  }, [user?.id, toast]);

  // Fonction pour connecter un compte email
  const connectEmail = async (provider: 'gmail' | 'outlook') => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`https://xqetqqjcmjdcnnswtgho.supabase.co/functions/v1/connect-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.getSession()}`
        },
        body: JSON.stringify({
          provider,
          user_id: user.id
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Rediriger vers l'URL d'authentification
      if (data.auth_url) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion du compte email:', error);
      toast({
        title: "Échec de la connexion",
        description: "Impossible de connecter votre compte email. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  // Calcul dynamique du pourcentage d'utilisation
  const callsLimit = userPlan === 'pro' ? 100 : 3;
  const callsUsed = callsThisMonth?.total_calls || 0;
  const usagePercentage = (callsUsed / callsLimit) * 100;
  const isNearLimit = userPlan === 'free' && callsUsed >= 2; // 2/3 pour le plan gratuit

  if (isLoading || isLoadingData) {
    return (
      <Layout title="Dashboard" showNavbar={true}>
        <DashboardLoading />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" showNavbar={true}>
      <div className="space-y-6 pb-6">
        {/* En-tête de bienvenue - Commun à tous les plans */}
        <DashboardWelcomeHeader 
          fullName={profile?.full_name} 
          userPlan={userPlan} 
        />

        {/* Alerte pour les appels à suivre */}
        {callsToFollow && callsToFollow.calls.length > 0 && (
          <Alert variant="default" className="bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="flex justify-between items-center">
              <span>{callsToFollow.calls.length} appel(s) sans relance client</span>
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
        {emailsToSend && emailsToSend.emails.length > 0 && (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Mail className="h-4 w-4 text-blue-500" />
            <AlertDescription className="flex justify-between items-center">
              <span>{emailsToSend.emails.length} relance(s) prête(s) à l'envoi</span>
              <Button variant="outline" size="sm" className="ml-2">
                Envoyer maintenant
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Alerte pour connecter un compte email */}
        {!profile?.email_synced && (
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

        {/* Afficher le contenu selon le plan */}
        {userPlan === 'pro' ? (
          <ProDashboardContent 
            navigate={navigate}
            tipIndex={tipIndex}
            callsUsed={callsThisMonth?.total_calls || 0}
            callsTotal={callsLimit}
            usagePercentage={usagePercentage}
          />
        ) : (
          <FreeDashboardContent 
            isFirstLogin={isFirstLogin} 
            hasRecentCall={hasRecentCall}
            navigate={navigate}
            tipIndex={tipIndex}
            callsUsed={callsThisMonth?.total_calls || 0}
            callsTotal={callsLimit}
            usagePercentage={usagePercentage}
          />
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
