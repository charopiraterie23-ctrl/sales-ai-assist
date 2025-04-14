
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnalysisResult {
  summary: string;
  key_points: string[];
  tags: string[];
  follow_up_email: {
    subject: string;
    body: string;
  };
}

export const analyzeCallTranscript = async (
  transcript: string,
  clientName: string,
  duration: number,
  context?: string
): Promise<AnalysisResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-call', {
      body: {
        transcript,
        clientName,
        duration,
        context
      }
    });

    if (error) throw error;
    
    return data as AnalysisResult;
  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'appel:', error);
    
    // Amélioration de la gestion des erreurs avec des messages plus précis
    if (error.message) {
      if (error.message.includes('quota') || (error.details && error.details.error && error.details.error.code === 'insufficient_quota')) {
        toast.error("Quota OpenAI dépassé. Veuillez vérifier votre plan de facturation OpenAI ou utiliser une nouvelle clé API.");
      } else if (error.errorType === 'api_key' || (error.details && error.details.error && error.details.error.code === 'invalid_api_key')) {
        toast.error("Clé API OpenAI invalide. Veuillez vérifier vos paramètres de configuration.");
      } else if (error.errorType === 'configuration') {
        toast.error("Configuration OpenAI manquante. Veuillez configurer votre clé API OpenAI.");
      } else {
        toast.error(`Erreur lors de l'analyse de l'appel: ${error.message}`);
      }
    } else {
      toast.error("Erreur lors de l'analyse de l'appel. Veuillez réessayer plus tard.");
    }
    
    throw error; // Propager l'erreur pour permettre une gestion au niveau supérieur
  }
};
