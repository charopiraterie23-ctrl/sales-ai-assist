
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('La clé API OpenAI n\'est pas configurée');
    return new Response(
      JSON.stringify({ 
        error: 'Configuration OpenAI manquante',
        errorType: 'configuration'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { transcript, clientName, duration, context } = await req.json();
    
    console.log(`Analyse d'un appel pour le client: ${clientName}, durée: ${duration}`);
    
    // Créer un prompt adapté pour l'analyse d'appel
    const prompt = `
Tu es un assistant de vente et de service client professionnel. Tu dois analyser cet appel téléphonique et fournir:
1. Un résumé concis (maximum 3 phrases)
2. Les points clés abordés (maximum 5 points)
3. Des tags pertinents (maximum 4)
4. Une suggestion d'email de suivi formaté et personnalisé

Informations sur l'appel:
- Client: ${clientName}
- Durée: ${duration} secondes
${context ? `- Contexte: ${context}` : ''}

Voici la transcription de l'appel:
${transcript}

Réponds en français au format JSON avec la structure suivante:
{
  "summary": "résumé concis de 2-3 phrases",
  "key_points": ["point 1", "point 2", ...],
  "tags": ["tag1", "tag2", ...],
  "follow_up_email": {
    "subject": "Objet de l'email",
    "body": "Corps de l'email"
  }
}
`;

    try {
      console.log('Préparation de l\'appel à l\'API OpenAI');
      
      // Appel à l'API OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Modèle recommandé pour ce type d'analyse
          messages: [
            { role: 'system', content: 'Tu es un assistant spécialisé dans l\'analyse d\'appels commerciaux qui génère du contenu en français.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      console.log(`Statut de la réponse OpenAI: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API OpenAI:', errorData);
        
        // Identifier le type d'erreur spécifique
        let errorType = 'api';
        let errorMessage = 'Erreur lors de l\'appel à OpenAI';
        
        if (errorData.error && errorData.error.code === 'insufficient_quota') {
          errorType = 'quota';
          errorMessage = 'Quota OpenAI dépassé. Veuillez vérifier votre plan de facturation OpenAI.';
          console.error('ERREUR DE QUOTA: Les crédits OpenAI semblent insuffisants');
        } else if (errorData.error && errorData.error.code === 'invalid_api_key') {
          errorType = 'api_key';
          errorMessage = 'Clé API OpenAI invalide.';
          console.error('ERREUR DE CLÉ API: La clé API OpenAI semble invalide');
        }
        
        return new Response(
          JSON.stringify({ 
            error: errorMessage, 
            errorType: errorType,
            details: errorData 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      console.log('Réponse d\'OpenAI reçue');
      
      // Extraire le contenu généré
      const content = data.choices[0].message.content;
      console.log('Contenu généré:', content);
      
      // Analyser le contenu JSON
      let analysisResult;
      try {
        analysisResult = JSON.parse(content);
        console.log('Analyse JSON réussie');
      } catch (e) {
        console.error('Erreur de parsing JSON:', e);
        
        // Tentative de fallback en extrayant manuellement le JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysisResult = JSON.parse(jsonMatch[0]);
            console.log('Analyse JSON de secours réussie');
          } catch (e2) {
            console.error('Deuxième tentative de parsing échouée:', e2);
            throw new Error('Format de réponse OpenAI non valide');
          }
        } else {
          throw new Error('Format de réponse OpenAI non valide');
        }
      }

      // Retourner les résultats
      return new Response(
        JSON.stringify(analysisResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (apiError) {
      console.error('Erreur lors de l\'appel à l\'API OpenAI:', apiError);
      return new Response(
        JSON.stringify({ 
          error: apiError.message, 
          errorType: 'api' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Erreur dans la fonction analyze-call:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        errorType: 'unknown' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
