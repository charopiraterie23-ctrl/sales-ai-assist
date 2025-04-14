
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import DashboardWelcomeHeader from '@/components/dashboard/DashboardWelcomeHeader';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import FreeDashboardContent from '@/components/dashboard/FreeDashboardContent';
import ProDashboardContent from '@/components/dashboard/ProDashboardContent';
import DashboardAlerts from '@/components/dashboard/DashboardAlerts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useEmailConnection } from '@/hooks/useEmailConnection';

const DashboardPage = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tipIndex, setTipIndex] = useState(0);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [hasRecentCall, setHasRecentCall] = useState(false);
  
  // Récupération des données du dashboard via le hook personnalisé
  const dashboardData = useDashboardData(user?.id);
  
  // Gestion de la connexion email via le hook personnalisé
  const { connectEmail } = useEmailConnection();
  
  // Explicitement normaliser le plan pour éviter les problèmes de casse
  const userPlan = profile?.plan?.toLowerCase() || 'free';

  // Rotation des astuces toutes les 10 secondes
  useState(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => {
        const tipsLength = userPlan === 'pro' ? 4 : 4; // Pourrait être dynamique selon la longueur des tableaux d'astuces
        return (prev + 1) % tipsLength;
      });
    }, 10000);
    
    return () => clearInterval(interval);
  });

  // Calcul dynamique du pourcentage d'utilisation
  const callsLimit = userPlan === 'pro' ? 100 : 3;
  const callsUsed = dashboardData.callsThisMonth?.total_calls || 0;
  const usagePercentage = (callsUsed / callsLimit) * 100;

  const handleConnectEmail = () => {
    connectEmail('gmail'); // Par défaut, on propose Gmail
  };

  if (isLoading || dashboardData.isLoadingData) {
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

        {/* Alertes du dashboard */}
        <DashboardAlerts 
          dashboardData={dashboardData} 
          userPlan={userPlan}
          connectEmail={connectEmail}
          emailSynced={profile?.email_synced}
        />

        {/* Afficher le contenu selon le plan */}
        {userPlan === 'pro' ? (
          <ProDashboardContent 
            navigate={navigate}
            tipIndex={tipIndex}
            callsUsed={callsUsed}
            callsTotal={callsLimit}
            usagePercentage={usagePercentage}
            dashboardData={dashboardData}
            isEmailConnected={profile?.email_synced || false}
            onConnectEmail={handleConnectEmail}
          />
        ) : (
          <FreeDashboardContent 
            isFirstLogin={isFirstLogin} 
            hasRecentCall={hasRecentCall}
            navigate={navigate}
            tipIndex={tipIndex}
            callsUsed={callsUsed}
            callsTotal={callsLimit}
            usagePercentage={usagePercentage}
          />
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
