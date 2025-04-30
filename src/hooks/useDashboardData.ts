
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  DashboardData,
  CallsThisMonth,
  EmailsToSend,
  CallsToFollow,
  UsageData
} from '@/types/dashboardTypes';
import { 
  fetchCallsData,
  fetchEmailsData,
  fetchFollowupData
} from '@/api/dashboardApi';

export const useDashboardData = (userId: string | undefined): DashboardData => {
  const [callsThisMonth, setCallsThisMonth] = useState<CallsThisMonth | null>(null);
  const [emailsToSend, setEmailsToSend] = useState<EmailsToSend | null>(null);
  const [callsToFollow, setCallsToFollow] = useState<CallsToFollow | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>({ minutesUsed: 0, totalMinutes: 120 });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingCalls, setIsLoadingCalls] = useState(true);
  const [isLoadingEmails, setIsLoadingEmails] = useState(true);
  const [isLoadingFollowup, setIsLoadingFollowup] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    if (!userId) return;
    
    setIsLoadingData(true);
    
    try {
      // Récupération parallèle des données pour optimiser la performance
      await Promise.all([
        fetchCallsDataFromApi(userId),
        fetchEmailsDataFromApi(userId),
        fetchFollowupDataFromApi(userId)
      ]);
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
  
  const fetchCallsDataFromApi = async (userId: string) => {
    setIsLoadingCalls(true);
    try {
      const data = await fetchCallsData(userId);
      setCallsThisMonth(data);
      
      // Mock usage data calculation based on calls
      // In a real app, this would come from the API
      setUsageData({
        minutesUsed: data.total_calls * 5, // Assume 5 minutes per call
        totalMinutes: 120 // Default limit for free plan
      });
    } catch (error) {
      console.error('Erreur lors du chargement des appels:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données d'appels.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCalls(false);
    }
  };
  
  const fetchEmailsDataFromApi = async (userId: string) => {
    setIsLoadingEmails(true);
    try {
      const emails = await fetchEmailsData(userId);
      setEmailsToSend({ emails });
    } catch (error) {
      console.error('Erreur lors du chargement des emails:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données d'emails.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEmails(false);
    }
  };
  
  const fetchFollowupDataFromApi = async (userId: string) => {
    setIsLoadingFollowup(true);
    try {
      const calls = await fetchFollowupData(userId);
      setCallsToFollow({ calls });
    } catch (error) {
      console.error('Erreur lors du chargement des appels à suivre:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données de suivi d'appels.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFollowup(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  return {
    callsThisMonth,
    emailsToSend,
    callsToFollow,
    usageData,
    isLoadingData,
    isLoadingCalls,
    isLoadingEmails,
    isLoadingFollowup,
    refetch: fetchDashboardData
  };
};

// Export types from the central type file to maintain backward compatibility
export type { DashboardData } from '@/types/dashboardTypes';

