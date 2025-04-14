
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
    console.log(`Envoi d'une demande d'analyse pour: ${clientName}, durée: ${duration}s`);
    
    if (!transcript || transcript.trim() === '') {
      toast.error("La transcription est vide. Impossible d'analyser l'appel.");
      throw new Error("Transcription vide");
    }
    
    // Stocker les métadonnées de l'appel dans localStorage
    const callMetadata = {
      clientName,
      duration,
      company: 'Entreprise', // Valeur par défaut, à remplacer par une vraie valeur si disponible
      date: new Date().toISOString()
    };
    
    localStorage.setItem('callMetadata', JSON.stringify(callMetadata));
    
    const { data, error } = await supabase.functions.invoke('analyze-call', {
      body: {
        transcript,
        clientName,
        duration,
        context
      }
    });

    if (error) {
      console.error('Erreur Supabase lors de l\'analyse:', error);
      throw error;
    }
    
    if (!data) {
      console.error('Aucune donnée reçue de la fonction analyze-call');
      toast.error("Aucune donnée reçue de l'analyse. Veuillez réessayer.");
      throw new Error("Aucune donnée reçue");
    }
    
    // Vérifier si la réponse contient une erreur
    if (data.error) {
      console.error('Erreur retournée par l\'API:', data);
      throw { 
        message: data.error,
        errorType: data.errorType,
        details: data.details
      };
    }
    
    console.log('Analyse reçue avec succès:', data);
    
    // Stocker les données d'analyse complètes dans localStorage (avec les métadonnées)
    const completeAnalysis = {
      ...data,
      clientName,
      duration,
      date: new Date().toISOString()
    };
    
    localStorage.setItem('callAnalysis', JSON.stringify(completeAnalysis));
    
    return data as AnalysisResult;
  } catch (error) {
    console.error('Erreur détaillée lors de l\'analyse de l\'appel:', error);
    
    // Amélioration de la gestion des erreurs avec des messages plus précis
    if (error.error && typeof error.error === 'string') {
      toast.error(error.error);
    } else if (error.message) {
      if (error.errorType === 'quota' || (error.details && error.details.error && error.details.error.code === 'insufficient_quota')) {
        toast.error("Quota OpenAI dépassé. Veuillez vérifier votre plan de facturation OpenAI ou utiliser une nouvelle clé API.");
      } else if (error.errorType === 'api_key' || (error.details && error.details.error && error.details.error.code === 'invalid_api_key')) {
        toast.error("Clé API OpenAI invalide. Veuillez vérifier vos paramètres de configuration.");
      } else if (error.errorType === 'configuration') {
        toast.error("Configuration OpenAI manquante. Veuillez configurer votre clé API OpenAI.");
      } else if (error.errorType === 'timeout') {
        toast.error("La requête a pris trop de temps. Veuillez réessayer avec une transcription plus courte.");
      } else if (error.errorType === 'rate_limit') {
        toast.error("Limite de requêtes OpenAI atteinte. Veuillez attendre quelques minutes et réessayer.");
      } else if (error.errorType === 'invalid_request') {
        toast.error(`Erreur de requête: ${error.message}`);
      } else {
        toast.error(`Erreur lors de l'analyse de l'appel: ${error.message}`);
      }
    } else {
      toast.error("Erreur lors de l'analyse de l'appel. Veuillez réessayer plus tard.");
    }
    
    throw error; // Propager l'erreur pour permettre une gestion au niveau supérieur
  }
};
