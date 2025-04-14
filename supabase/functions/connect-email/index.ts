
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Configuration URLs pour OAuth2
const GMAIL_AUTH_URL = "https://accounts.google.com/o/oauth2/auth";
const OUTLOOK_AUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

// Les identifiants sont récupérés depuis les variables d'environnement
const GMAIL_CLIENT_ID = Deno.env.get("GMAIL_CLIENT_ID") || "";
const OUTLOOK_CLIENT_ID = Deno.env.get("OUTLOOK_CLIENT_ID") || "";
const REDIRECT_URI = Deno.env.get("EMAIL_OAUTH_REDIRECT_URI") || "";

// Vérification des variables d'environnement requises
if (!GMAIL_CLIENT_ID) console.warn("ATTENTION: GMAIL_CLIENT_ID non défini dans les variables d'environnement");
if (!OUTLOOK_CLIENT_ID) console.warn("ATTENTION: OUTLOOK_CLIENT_ID non défini dans les variables d'environnement");
if (!REDIRECT_URI) console.warn("ATTENTION: EMAIL_OAUTH_REDIRECT_URI non défini dans les variables d'environnement");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface ConnectEmailRequest {
  provider: "gmail" | "outlook";
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, user_id }: ConnectEmailRequest = await req.json();
    
    console.log(`Demande de connexion pour le provider ${provider} et l'utilisateur ${user_id}`);
    
    // Vérifier que les identifiants clients sont définis
    if ((provider === "gmail" && !GMAIL_CLIENT_ID) || (provider === "outlook" && !OUTLOOK_CLIENT_ID)) {
      console.error(`Erreur: ${provider === "gmail" ? "GMAIL_CLIENT_ID" : "OUTLOOK_CLIENT_ID"} n'est pas configuré`);
      return new Response(
        JSON.stringify({ 
          error: `L'identifiant client pour ${provider} n'est pas configuré. Veuillez contacter l'administrateur.`,
          env_check: {
            gmail_client_id_defined: !!GMAIL_CLIENT_ID,
            outlook_client_id_defined: !!OUTLOOK_CLIENT_ID,
            redirect_uri_defined: !!REDIRECT_URI
          }
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Vérifier que l'URL de redirection est définie
    if (!REDIRECT_URI) {
      console.error("Erreur: EMAIL_OAUTH_REDIRECT_URI n'est pas configuré");
      return new Response(
        JSON.stringify({ error: "L'URL de redirection n'est pas configurée. Veuillez contacter l'administrateur." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Vérifier que l'utilisateur existe
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (error || !profile) {
      console.error("Utilisateur non trouvé:", error);
      return new Response(
        JSON.stringify({ error: "Utilisateur non trouvé" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Construire l'URL d'autorisation OAuth2 selon le provider
    let authUrl;
    const state = JSON.stringify({ user_id, provider }); // Pour récupérer l'info au callback
    
    if (provider === "gmail") {
      // Amélioration des scopes pour Gmail
      const scopes = [
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
      ].join(" ");
      
      authUrl = `${GMAIL_AUTH_URL}?client_id=${encodeURIComponent(GMAIL_CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`;
    } else if (provider === "outlook") {
      // Amélioration des scopes pour Outlook
      const scopes = [
        "Mail.Send",
        "Mail.Send.Shared",
        "User.Read",
        "offline_access"
      ].join(" ");
      
      authUrl = `${OUTLOOK_AUTH_URL}?client_id=${encodeURIComponent(OUTLOOK_CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state)}`;
    } else {
      return new Response(
        JSON.stringify({ error: "Provider invalide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`URL d'authentification générée pour ${provider}:`, authUrl);

    // Renvoyer l'URL d'autorisation pour redirection côté client
    return new Response(
      JSON.stringify({ 
        auth_url: authUrl,
        provider 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur dans la fonction connect-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
