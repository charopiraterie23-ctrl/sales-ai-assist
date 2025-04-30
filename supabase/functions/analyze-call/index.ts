
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Vérifier si la clé OpenAI semble valide (longueur minimale)
    if (openAIApiKey.length < 20) {
      console.error('La clé API OpenAI semble invalide (trop courte)');
      return new Response(
        JSON.stringify({ 
          error: 'Clé API OpenAI invalide',
          errorType: 'api_key'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let requestData;
    try {
      requestData = await req.json();
      console.log('Données de requête reçues ✓');
    } catch (parseError) {
      console.error('Erreur de parsing JSON de la requête:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Format de requête invalide', 
          errorType: 'invalid_request' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { transcript, clientName, duration, context, messageType = 'email' } = requestData;
    
    console.log(`Analyse d'un message pour le client: ${clientName}, type: ${messageType}`);
    console.log(`Clé API OpenAI présente: ${openAIApiKey ? 'Oui' : 'Non'}`);
    console.log(`Longueur de la clé API: ${openAIApiKey?.length || 0} caractères`);
    console.log(`Transcription reçue (longueur): ${transcript?.length || 0} caractères`);
    
    // Vérifier que les données essentielles sont présentes
    if (!transcript || transcript.trim() === '') {
      console.error('Transcription manquante ou vide');
      return new Response(
        JSON.stringify({ 
          error: 'Transcription manquante', 
          errorType: 'data' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!clientName) {
      console.error('Nom du client manquant');
      return new Response(
        JSON.stringify({ 
          error: 'Nom du client manquant', 
          errorType: 'data' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Créer un prompt adapté selon le type de message demandé
    let prompt = '';
    
    if (messageType === 'sms') {
      prompt = `
Tu es un assistant de vente et de service client professionnel. Tu dois analyser ce message vocal et créer:
1. Un SMS concis et professionnel (maximum 160 caractères)

Informations:
- Client: ${clientName}
${context ? `- Contexte: ${context}` : ''}

Voici la transcription du message vocal:
${transcript}

Réponds en français au format JSON avec la structure suivante:
{
  "sms_content": "contenu du SMS adapté aux besoins exprimés dans la transcription (max 160 caractères)"
}
`;
    } else {
      prompt = `
Tu es un assistant de vente et de service client professionnel. Tu dois analyser ce message vocal et créer:
1. Un email de suivi formaté et personnalisé, adapté au contenu du message vocal.

Informations:
- Client: ${clientName}
${context ? `- Contexte: ${context}` : ''}

Voici la transcription du message vocal:
${transcript}

Réponds en français au format JSON avec la structure suivante:
{
  "follow_up_email": {
    "subject": "Objet de l'email",
    "body": "Corps de l'email"
  }
}
`;
    }
    
    try {
      console.log('Préparation de l\'appel à l\'API OpenAI');
      console.log('Modèle utilisé: gpt-4o-mini');
      
      // Appel à l'API OpenAI avec un timeout plus court
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        console.log('Timeout de la requête OpenAI déclenché');
        controller.abort();
      }, 25000); // 25 secondes de timeout
      
      console.log('Envoi de la requête à l\'API OpenAI');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', 
          messages: [
            { role: 'system', content: 'Tu es un assistant spécialisé dans la création de messages professionnels qui génère du contenu en français.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,
          max_tokens: 800,
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      console.log(`Réponse de l'API OpenAI reçue avec statut: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API OpenAI détaillée:', JSON.stringify(errorData));
        
        // Identifier le type d'erreur spécifique
        let errorType = 'api';
        let errorMessage = 'Erreur lors de l\'appel à OpenAI';
        
        if (errorData.error) {
          console.error(`Code d'erreur OpenAI: ${errorData.error.code}, Type: ${errorData.error.type}`);
          
          if (errorData.error.code === 'insufficient_quota') {
            errorType = 'quota';
            errorMessage = 'Quota OpenAI dépassé. Veuillez vérifier votre plan de facturation OpenAI.';
          } else if (errorData.error.code === 'invalid_api_key') {
            errorType = 'api_key';
            errorMessage = 'Clé API OpenAI invalide.';
          } else if (errorData.error.type === 'invalid_request_error') {
            errorType = 'invalid_request';
            errorMessage = `Requête invalide: ${errorData.error.message}`;
          } else if (errorData.error.type === 'rate_limit_exceeded') {
            errorType = 'rate_limit';
            errorMessage = 'Limite de débit dépassée. Veuillez réessayer dans quelques instants.';
          } else if (errorData.error.message) {
            errorMessage = `Erreur OpenAI: ${errorData.error.message}`;
          }
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
      console.log('Réponse d\'OpenAI reçue et parsée avec succès');
      
      // Extraire le contenu généré
      const content = data.choices[0].message.content;
      console.log('Contenu généré (début):', content.substring(0, 100) + '...');
      
      // Analyser le contenu JSON
      let result;
      try {
        result = JSON.parse(content);
        console.log('Analyse JSON réussie');
        
        // Vérifier la structure du résultat selon le type de message
        if (messageType === 'sms' && !result.sms_content) {
          console.error('Structure JSON incomplète dans la réponse OpenAI (sms_content manquant)');
          throw new Error('Structure JSON incomplète');
        } else if (messageType === 'email' && (!result.follow_up_email || !result.follow_up_email.subject || !result.follow_up_email.body)) {
          console.error('Structure JSON incomplète dans la réponse OpenAI (follow_up_email incomplet)');
          throw new Error('Structure JSON incomplète');
        }
      } catch (e) {
        console.error('Erreur de parsing JSON:', e);
        
        // Tentative de fallback en extrayant manuellement le JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            result = JSON.parse(jsonMatch[0]);
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
      console.log('Analyse terminée avec succès, envoi de la réponse');
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (apiError) {
      console.error('Erreur lors de l\'appel à l\'API OpenAI:', apiError);
      
      // Gérer les erreurs de timeout
      if (apiError.name === 'AbortError') {
        return new Response(
          JSON.stringify({ 
            error: 'La requête à OpenAI a expiré. Veuillez réessayer avec une transcription plus courte.', 
            errorType: 'timeout' 
          }),
          { status: 408, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
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
