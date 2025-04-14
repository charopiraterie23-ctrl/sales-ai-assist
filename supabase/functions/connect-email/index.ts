
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Configuration URLs pour OAuth2
const GMAIL_AUTH_URL = "https://accounts.google.com/o/oauth2/auth";
const OUTLOOK_AUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

// Les identifiants seraient normalement stockés dans les variables d'environnement
const GMAIL_CLIENT_ID = Deno.env.get("GMAIL_CLIENT_ID") || "";
const OUTLOOK_CLIENT_ID = Deno.env.get("OUTLOOK_CLIENT_ID") || "";
const REDIRECT_URI = Deno.env.get("EMAIL_OAUTH_REDIRECT_URI") || "";

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
    
    // Vérifier que l'utilisateur existe
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (error || !profile) {
      console.error("User not found:", error);
      return new Response(
        JSON.stringify({ error: "User not found" }),
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
      
      authUrl = `${GMAIL_AUTH_URL}?client_id=${GMAIL_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`;
    } else if (provider === "outlook") {
      // Amélioration des scopes pour Outlook
      const scopes = [
        "Mail.Send",
        "Mail.Send.Shared",
        "User.Read",
        "offline_access"
      ].join(" ");
      
      authUrl = `${OUTLOOK_AUTH_URL}?client_id=${OUTLOOK_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(state)}`;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid provider" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Renvoyer l'URL d'autorisation pour redirection côté client
    return new Response(
      JSON.stringify({ 
        auth_url: authUrl,
        provider 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in connect-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
