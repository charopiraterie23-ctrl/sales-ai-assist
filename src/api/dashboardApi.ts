
import { supabase } from '@/integrations/supabase/client';
import { CallsThisMonth, Email, Call } from '@/types/dashboardTypes';

export const fetchCallsData = async (userId: string): Promise<CallsThisMonth> => {
  // Récupérer le nombre d'appels ce mois-ci
  const { data: callsData, error: callsError } = await supabase
    .from('calls')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    .lte('created_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString());
  
  if (callsError) throw callsError;
  
  // Compter le nombre d'appels
  return { total_calls: callsData ? callsData.length : 0 };
};

export const fetchEmailsData = async (userId: string): Promise<Email[]> => {
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
  return emailsData ? emailsData.map(email => ({
    id: email.id,
    to: email.to_email,
    subject: email.subject,
    body: email.body,
    summary_id: email.summary_id
  })) : [];
};

export const fetchFollowupData = async (userId: string): Promise<Call[]> => {
  // Récupérer les appels à relancer aujourd'hui
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const { data: callsData, error: callsError } = await supabase
    .from('calls')
    .select(`
      id, client_id, created_at,
      summaries(id, followup_emails(status))
    `)
    .eq('user_id', userId)
    .lte('created_at', twoDaysAgo.toISOString());
  
  if (callsError) throw callsError;
  
  // Filtrer les appels sans email de suivi envoyé
  return callsData ? callsData.filter(call => {
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
};
