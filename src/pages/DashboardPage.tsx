
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useEmailConnection } from '@/hooks/useEmailConnection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Calendar, Link } from 'lucide-react';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import IntegrationsCard from '@/components/dashboard/IntegrationsCard';
import TodaySummaryCard from '@/components/dashboard/TodaySummaryCard';
import DraftEmailsCard from '@/components/dashboard/DraftEmailsCard';
import InsightsCard from '@/components/dashboard/InsightsCard';
import ActiveClientsCard from '@/components/dashboard/ActiveClientsCard';

const DashboardPage = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasRecentCall, setHasRecentCall] = useState(false);
  
  // Récupération des données du dashboard via le hook personnalisé
  const dashboardData = useDashboardData(user?.id);
  
  // Gestion de la connexion email via le hook personnalisé
  const { connectEmail, connectedAccounts } = useEmailConnection();
  
  // Explicitement normaliser le plan pour éviter les problèmes de casse
  const userPlan = profile?.plan?.toLowerCase() || 'pro';

  // Vérifier si l'email est connecté
  const isEmailConnected = connectedAccounts?.some(account => account.connected) || false;
  
  // Vérifier si le SMS est connecté (à implémenter)
  const isSMSConnected = false; // Placeholder pour la future fonctionnalité

  // Calcul dynamique des KPIs
  const pendingCallsToday = dashboardData.callsToFollow?.calls.length || 0;
  const readyEmails = dashboardData.emailsToSend?.emails.length || 0;
  const clientsToFollowUp = 0; // Placeholder pour la future fonctionnalité
  
  if (isLoading || dashboardData.isLoadingData) {
    return (
      <Layout title="Accueil" showNavbar={true} showFAB={false}>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg w-3/4"></div>
            <div className="h-36 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-36 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Accueil" showNavbar={true} showFAB={false}>
      <div className="space-y-4 pb-20">
        {/* Message de bienvenue */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-1">
            Bonjour {profile?.full_name?.split(' ')[0] || 'utilisateur'} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Prêt·e pour une journée productive ?
          </p>
        </div>

        {/* Carte intégrations - affichée seulement si email ou SMS non connectés */}
        {(!isEmailConnected || !isSMSConnected) && (
          <IntegrationsCard 
            isEmailConnected={isEmailConnected} 
            isSMSConnected={isSMSConnected} 
            onConnectEmail={() => connectEmail('gmail')}
            onConnectSMS={() => console.log('SMS connect functionality to be implemented')} 
          />
        )}

        {/* Carte Ma Journée */}
        <TodaySummaryCard 
          pendingCallsToday={pendingCallsToday}
          readyEmails={readyEmails}
          clientsToFollowUp={clientsToFollowUp}
          navigateToActions={() => navigate('/daily-actions')}
        />

        {/* Bouton Nouveau résumé */}
        <Button 
          className="w-full py-6 text-lg rounded-3xl shadow-md bg-[#2166F0] hover:bg-blue-600 transition-all"
          onClick={() => navigate('/record')}
        >
          <Plus className="mr-2" /> Nouveau résumé
        </Button>

        {/* Section Fil d'activité */}
        <div className="pt-2">
          <h2 className="text-lg font-semibold mb-2">Fil d'activité</h2>
          <ScrollArea className="h-[38vh] rounded-2xl border">
            <ActivityFeed />
          </ScrollArea>
        </div>

        {/* Carte Brouillons à envoyer */}
        <DraftEmailsCard 
          isEmailConnected={isEmailConnected}
          isLoading={dashboardData.isLoadingEmails}
          emails={dashboardData.emailsToSend?.emails}
          onConnectEmail={() => connectEmail('gmail')}
          onSendAll={() => console.log('Send all functionality to be implemented')}
        />

        {/* Carte Insights */}
        <InsightsCard />

        {/* Carte Clients actifs */}
        <ActiveClientsCard />
        
        {/* Spacer pour bottom nav */}
        <div className="h-[72px]"></div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
