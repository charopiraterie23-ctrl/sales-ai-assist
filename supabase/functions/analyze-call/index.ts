
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
        fallback: true, 
        fallbackData: getDemoAnalysisResult() 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API OpenAI:', errorData);
        
        // Retourner des données de démonstration en cas d'erreur
        return new Response(
          JSON.stringify({ 
            error: 'Erreur lors de l\'appel à OpenAI', 
            details: errorData,
            fallback: true, 
            fallbackData: getDemoAnalysisResult(clientName, context) 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      console.log('Réponse d\'OpenAI reçue');
      
      // Extraire le contenu généré
      const content = data.choices[0].message.content;
      
      // Analyser le contenu JSON
      let analysisResult;
      try {
        analysisResult = JSON.parse(content);
      } catch (e) {
        console.error('Erreur de parsing JSON:', e);
        
        // Tentative de fallback en extrayant manuellement le JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysisResult = JSON.parse(jsonMatch[0]);
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
      
      // Retourner des données de démonstration en cas d'erreur d'API
      return new Response(
        JSON.stringify({ 
          error: apiError.message, 
          fallback: true, 
          fallbackData: getDemoAnalysisResult(clientName, context) 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Erreur dans la fonction analyze-call:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: true, 
        fallbackData: getDemoAnalysisResult() 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Fonction pour générer des données de démonstration
function getDemoAnalysisResult(clientName = "Client", context = "Suivi commercial") {
  const demoResults = [
    {
      summary: "Discussion sur l'implémentation du CRM avec accord pour une formation le jeudi 20. Le client trouve la documentation utile et a des questions sur la migration des données.",
      key_points: [
        "La documentation envoyée a été utile pour le client",
        "Formation planifiée pour le jeudi 20 à 14h",
        "Préoccupation exprimée sur la migration des données",
        "Un spécialiste migration sera mis en contact avec le client",
        "Un récapitulatif sera envoyé par email"
      ],
      tags: ["formation", "implementation", "crm", "migration"],
      follow_up_email: {
        subject: "Récapitulatif de notre appel - Implémentation CRM et formation",
        body: `Bonjour ${clientName},\n\nMerci pour notre conversation d'aujourd'hui concernant l'implémentation du CRM.\n\nJe confirme notre session de formation prévue le jeudi 20 à 14h. D'ici là, notre spécialiste migration vous contactera pour discuter de vos préoccupations concernant la migration des données.\n\nN'hésitez pas à me contacter si vous avez d'autres questions.\n\nCordialement,\nL'équipe Nexentry`
      }
    },
    {
      summary: "Négociation du renouvellement de contrat avec proposition d'une offre spéciale Premium au prix de l'offre Pro pour un engagement de 12 mois. Le client est intéressé et attend les détails par email.",
      key_points: [
        "Le contrat arrive à échéance le mois prochain",
        "Le client a des contraintes budgétaires ce trimestre",
        "Offre spéciale proposée : Premium au prix de Pro pour un engagement de 12 mois",
        "Le client est intéressé par cette offre",
        "Détails à envoyer par email aujourd'hui"
      ],
      tags: ["renouvellement", "négociation", "budget", "offre_spéciale"],
      follow_up_email: {
        subject: "Détails de notre offre spéciale - Renouvellement de contrat",
        body: `Bonjour ${clientName},\n\nSuite à notre conversation téléphonique, je vous transmets les détails de notre offre spéciale pour le renouvellement de votre contrat.\n\nComme discuté, vous pouvez bénéficier de notre formule Premium au tarif de la formule Pro, soit une économie de 20%, en vous engageant pour 12 mois.\n\nCette offre inclut tous les avantages Premium :\n- Fonctionnalités avancées de reporting\n- Support prioritaire 7j/7\n- Intégrations illimitées\n- Formations mensuelles pour votre équipe\n\nCette offre est valable jusqu'au 30 du mois. N'hésitez pas à me contacter pour toute question.\n\nCordialement,\nL'équipe Nexentry`
      }
    }
  ];

  // Sélectionner un résultat de démo aléatoire
  const demoResult = demoResults[Math.floor(Math.random() * demoResults.length)];
  
  // Personnaliser le résultat avec le nom du client et le contexte si fournis
  if (clientName !== "Client") {
    demoResult.follow_up_email.body = demoResult.follow_up_email.body.replace("Client", clientName);
  }
  
  return demoResult;
}
