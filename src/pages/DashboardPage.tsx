
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useEmailConnection } from '@/hooks/useEmailConnection';
import { toast } from '@/components/ui/sonner';
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
import DashboardLoading from '@/components/dashboard/DashboardLoading';

const DashboardPage = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasRecentCall, setHasRecentCall] = useState(false);
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  
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
  
  const handleSendAllEmails = () => {
    // Simuler l'envoi des emails
    console.log('Sending all emails:', dashboardData.emailsToSend?.emails);
  };
  
  if (isLoading || dashboardData.isLoadingData) {
    return (
      <Layout title="Accueil" showNavbar={true} showFAB={false}>
        <DashboardLoading />
      </Layout>
    );
  }

  return (
    <Layout title="Accueil" showNavbar={true} showFAB={false}>
      <div className="space-y-4 pb-20">
        {/* Message de bienvenue avec minutes restantes */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-1">
            Bonjour {profile?.full_name?.split(' ')[0] || 'utilisateur'} 👋
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300">
              Prêt·e pour une journée productive ?
            </p>
            {showTrialBanner && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {trialMinutesRemaining} min audio restantes
              </span>
            )}
            {userPlan === 'pro' && (
              <div className="flex items-center">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Plan Pro actif
                </span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-xs ml-1 p-0 h-auto"
                  onClick={() => navigate('/settings?tab=billing')}
                >
                  Gérer
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Carte intégrations - affichée seulement si email ou SMS non connectés */}
        <IntegrationsCard 
          isEmailConnected={isEmailConnected} 
          isSMSConnected={isSMSConnected} 
          onConnectEmail={() => connectEmail('gmail')}
          onConnectSMS={() => console.log('SMS connect functionality to be implemented')} 
        />

        {/* Carte Ma Journée */}
        <TodaySummaryCard 
          pendingCallsToday={pendingCallsToday}
          readyEmails={readyEmails}
          clientsToFollowUp={clientsToFollowUp}
          navigateToActions={() => navigate('/daily-actions')}
          isClickToCallEnabled={false}
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
            <ActivityFeed 
              isLoading={isActivityLoading}
              activities={mockActivities} 
            />
          </ScrollArea>
        </div>

        {/* Carte Brouillons à envoyer */}
        <DraftEmailsCard 
          isEmailConnected={isEmailConnected}
          isLoading={dashboardData.isLoadingEmails}
          emails={dashboardData.emailsToSend?.emails}
          onConnectEmail={() => connectEmail('gmail')}
          onSendAll={handleSendAllEmails}
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

// Sample activities for development
const mockActivities = [
  {
    id: '1',
    title: 'Appel avec Jean Dupont',
    excerpt: 'Discussion sur le projet de refonte du site web. Prochaine étape: valider la maquette.',
    tags: [{ name: 'urgent', color: 'red' }, { name: 'web', color: 'blue' }],
    status: 'new' as 'new' | 'sent' | 'archived'
  },
  {
    id: '2',
    title: 'Réunion équipe marketing',
    excerpt: 'Planification de la campagne Q2. Budget validé à 15k$.',
    tags: [{ name: 'marketing', color: 'green' }],
    status: 'sent' as 'new' | 'sent' | 'archived'
  },
  {
    id: '3',
    title: 'Appel de suivi Sophie Martin',
    excerpt: "Intérêt pour l'offre premium. Relancer dans 2 semaines.",
    tags: [{ name: 'lead', color: 'purple' }],
    status: 'new' as 'new' | 'sent' | 'archived'
  },
  {
    id: '4',
    title: 'Point hebdo Jacques',
    excerpt: 'Revue des KPIs et ajustement des objectifs du trimestre.',
    tags: [{ name: 'interne', color: 'gray' }],
    status: 'archived' as 'new' | 'sent' | 'archived'
  },
  {
    id: '5',
    title: 'Consultation Entreprise ABC',
    excerpt: 'Besoin identifié: solution de gestion de projet. Budget ~5k$/mois.',
    tags: [{ name: 'opportunité', color: 'amber' }],
    status: 'sent' as 'new' | 'sent' | 'archived'
  }
];

export default DashboardPage;

