
import { supabase } from '@/integrations/supabase/client';

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
    throw error;
  }
};
