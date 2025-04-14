
import { supabase } from '@/integrations/supabase/client';
import { Email } from '@/types/dashboardTypes';

export const sendEmail = async (emailId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { data, error } = await supabase
      .functions
      .invoke('send-email', {
        body: { emailId }
      });
    
    if (error) throw error;
    
    // Mettre à jour le statut de l'email dans la base de données
    await supabase
      .from('followup_emails')
      .update({ status: 'envoyé', send_date: new Date().toISOString() })
      .eq('id', emailId);
    
    return { success: true, message: 'Email envoyé avec succès' };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return { success: false, message: 'Erreur lors de l\'envoi' };
  }
};

export const updateEmailStatus = async (emailId: string, status: 'à envoyer' | 'envoyé' | 'brouillon'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('followup_emails')
      .update({ status })
      .eq('id', emailId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de l\'email:', error);
    return false;
  }
};
