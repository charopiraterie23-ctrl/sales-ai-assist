
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useEmailConnection } from '@/hooks/useEmailConnection';
import { toast } from '@/components/ui/sonner';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardWelcomeHeader from '@/components/dashboard/DashboardWelcomeHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';

const DashboardPage = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasRecentCall, setHasRecentCall] = useState(false);
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(Math.floor(Math.random() * 4)); // Random tip index
  
  // Récupération des données du dashboard via le hook personnalisé
  const dashboardData = useDashboardData(user?.id);
  
  // Gestion de la connexion email via le hook personnalisé
  const { connectEmail, connectedAccounts } = useEmailConnection();
  
  useEffect(() => {
    // Simulate activity feed loading
    const timer = setTimeout(() => {
      setIsActivityLoading(false);
    }, 1000);
    
    // Show "Summary generated" toast if coming from record page
    const urlParams = new URLSearchParams(window.location.search);
    const summaryGenerated = urlParams.get('summaryGenerated');
    
    if (summaryGenerated) {
      toast("Résumé généré avec succès! ✅", {
        description: "Votre résumé a été ajouté à votre liste d'activités",
        position: "top-center",
        duration: 3500
      });
      // Clean up the URL
      window.history.replaceState(null, '', '/dashboard');
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  // Explicitement normaliser le plan pour éviter les problèmes de casse
  const userPlan = profile?.plan?.toLowerCase() || 'pro';
  
  // Calculate remaining minutes for trial period
  const trialMinutesRemaining = 120 - (dashboardData.usageData?.minutesUsed || 0);
  const showTrialBanner = userPlan === 'free' && trialMinutesRemaining > 0;

  // Vérifier si l'email est connecté
  const isEmailConnected = connectedAccounts?.some(account => account.connected) || false;
  
  // Vérifier si le SMS est connecté (à implémenter)
  const isSMSConnected = false; // Placeholder pour la future fonctionnalité

  // Calcul dynamique des KPIs
  const pendingCallsToday = dashboardData.callsToFollow?.calls.length || 0;
  const readyEmails = dashboardData.emailsToSend?.emails.length || 0;
  const clientsToFollowUp = 0; // Placeholder pour la future fonctionnalité
  
  // Calcul pour l'affichage de l'utilisation
  const callsUsed = dashboardData.callsThisMonth?.total_calls || 0;
  const callsTotal = userPlan === 'pro' ? 100 : 3; // Limits based on plan
  const usagePercentage = Math.min(100, Math.round((callsUsed / callsTotal) * 100));
  
  if (isLoading || dashboardData.isLoadingData) {
    return (
      <Layout title="Accueil" showNavbar={true} showFAB={true}>
        <DashboardLoading />
      </Layout>
    );
  }

  return (
    <Layout title="Accueil" showNavbar={true} showFAB={true}>
      <div className="space-y-6 pb-20">
        {/* Message de bienvenue avec minutes restantes */}
        <DashboardWelcomeHeader 
          fullName={profile?.full_name?.split(' ')[0] || 'utilisateur'} 
          userPlan={userPlan}
          trialMinutesRemaining={trialMinutesRemaining}
          showTrialBanner={showTrialBanner}
        />

        {/* Content based on user plan */}
        <DashboardContent
          userPlan={userPlan}
          isEmailConnected={isEmailConnected}
          isSMSConnected={isSMSConnected}
          pendingCallsToday={pendingCallsToday}
          readyEmails={readyEmails}
          clientsToFollowUp={clientsToFollowUp}
          callsUsed={callsUsed}
          callsTotal={callsTotal}
          usagePercentage={usagePercentage}
          dashboardData={dashboardData}
          isActivityLoading={isActivityLoading}
          hasRecentCall={hasRecentCall}
          navigate={navigate}
          tipIndex={tipIndex}
          onConnectEmail={() => connectEmail('gmail')}
        />
      </div>
    </Layout>
  );
};

export default DashboardPage;
