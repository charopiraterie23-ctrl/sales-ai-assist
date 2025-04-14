
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
    
    // Vérifier si nous avons reçu des données de fallback en cas d'erreur d'API
    if (data.fallback && data.fallbackData) {
      toast.warning("Mode démo activé : L'API OpenAI n'est pas disponible actuellement. Des données simulées sont utilisées.", {
        duration: 6000
      });
      console.info("Mode démo : utilisation de données simulées pour l'analyse d'appel");
      return data.fallbackData as AnalysisResult;
    }
    
    return data as AnalysisResult;
  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'appel:', error);
    
    // Afficher un toast d'erreur plus descriptif
    if (error.message && error.message.includes('quota')) {
      toast.error("Quota OpenAI dépassé. Veuillez vérifier votre plan de facturation OpenAI.");
    } else {
      toast.error("Erreur lors de l'analyse de l'appel. Mode démo activé.");
    }
    
    // Génération d'un résultat de démonstration en cas d'erreur côté client
    return generateDemoResult(clientName, context);
  }
};

// Fonction de démonstration pour générer des données sans appel à l'API
function generateDemoResult(clientName: string = "Client", context?: string): AnalysisResult {
  const demoData: AnalysisResult = {
    summary: "Discussion de suivi concernant l'implémentation du produit. Le client est satisfait de la documentation et une session de formation a été planifiée pour la semaine prochaine.",
    key_points: [
      "Documentation bien reçue et appréciée",
      "Formation planifiée pour la semaine prochaine",
      "Questions sur la migration des données",
      "Mise en relation avec un spécialiste prévue",
      "Envoi d'un récapitulatif par email"
    ],
    tags: ["formation", "implémentation", "support", "migration"],
    follow_up_email: {
      subject: `Récapitulatif de notre appel - ${context || "Suivi commercial"}`,
      body: `Bonjour ${clientName},\n\nMerci pour notre conversation d'aujourd'hui.\n\nJe confirme que nous avons bien planifié une session de formation pour la semaine prochaine et qu'un spécialiste migration vous contactera très prochainement pour répondre à vos questions.\n\nN'hésitez pas à me contacter si vous avez besoin d'informations supplémentaires d'ici là.\n\nCordialement,\nL'équipe Nexentry`
    }
  };
  
  return demoData;
}
