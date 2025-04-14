
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

export interface DashboardData {
  callsThisMonth: CallsThisMonth | null;
  emailsToSend: EmailsToSend | null;
  callsToFollow: CallsToFollow | null;
  isLoadingData: boolean;
  isLoadingCalls: boolean;
  isLoadingEmails: boolean;
  isLoadingFollowup: boolean;
  refetch: () => Promise<void>;
}

export const useDashboardData = (userId: string | undefined) => {
  const [callsThisMonth, setCallsThisMonth] = useState<CallsThisMonth | null>(null);
  const [emailsToSend, setEmailsToSend] = useState<EmailsToSend | null>(null);
  const [callsToFollow, setCallsToFollow] = useState<CallsToFollow | null>(null);
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
        fetchCallsData(userId),
        fetchEmailsData(userId),
        fetchFollowupData(userId)
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
  
  const fetchCallsData = async (userId: string) => {
    setIsLoadingCalls(true);
    try {
      // Récupérer le nombre d'appels ce mois-ci
      const { data: callsData, error: callsError } = await supabase
        .from('calls')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .lte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString());
      
      if (callsError) throw callsError;
      
      // Compter le nombre d'appels
      setCallsThisMonth({ total_calls: callsData ? callsData.length : 0 });
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
  
  const fetchEmailsData = async (userId: string) => {
    setIsLoadingEmails(true);
    try {
      // Récupérer les emails prêts à l'envoi
      const { data: emailsData, error: emailsError } = await supabase
        .from('followup_emails')
        .select(`
          id, to_email, subject, body, summary_id,
          summaries!inner(call_id, calls!inner(user_id))
        `)
        .eq('status', 'à envoyer')
        .eq('summaries.calls.user_id', userId);
      
      if (emailsError) throw emailsError;
      
      // Formater les données pour correspondre à notre interface
      const formattedEmails: Email[] = emailsData ? emailsData.map(email => ({
        id: email.id,
        to: email.to_email,
        subject: email.subject,
        body: email.body,
        summary_id: email.summary_id
      })) : [];
      
      setEmailsToSend({ emails: formattedEmails });
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
  
  const fetchFollowupData = async (userId: string) => {
    setIsLoadingFollowup(true);
    try {
      // Récupérer les appels à relancer aujourd'hui
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const { data: callsData2, error: callsError2 } = await supabase
        .from('calls')
        .select(`
          id, client_id, created_at,
          summaries(id, followup_emails(status))
        `)
        .eq('user_id', userId)
        .lte('created_at', twoDaysAgo.toISOString());
      
      if (callsError2) throw callsError2;
      
      // Filtrer les appels sans email de suivi envoyé
      const callsToFollowUp = callsData2 ? callsData2.filter(call => {
        // Pas de résumé ou pas d'emails
        if (!call.summaries || call.summaries.length === 0) return true;
        
        // Vérifier si au moins un email a été envoyé
        const hasFollowupEmailSent = call.summaries.some(summary => 
          summary.followup_emails && 
          summary.followup_emails.some(email => email.status === 'envoyé')
        );
        
        return !hasFollowupEmailSent;
      }).map(call => ({
        id: call.id,
        client_id: call.client_id,
        created_at: call.created_at
      })) : [];
      
      setCallsToFollow({ calls: callsToFollowUp });
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
    isLoadingData,
    isLoadingCalls,
    isLoadingEmails,
    isLoadingFollowup,
    refetch: fetchDashboardData
  };
};
