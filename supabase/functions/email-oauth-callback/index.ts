
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Les identifiants seraient normalement stockés dans les variables d'environnement
const GMAIL_CLIENT_ID = Deno.env.get("GMAIL_CLIENT_ID") || "";
const GMAIL_CLIENT_SECRET = Deno.env.get("GMAIL_CLIENT_SECRET") || "";
const OUTLOOK_CLIENT_ID = Deno.env.get("OUTLOOK_CLIENT_ID") || "";
const OUTLOOK_CLIENT_SECRET = Deno.env.get("OUTLOOK_CLIENT_SECRET") || "";
const REDIRECT_URI = Deno.env.get("EMAIL_OAUTH_REDIRECT_URI") || "";

const GMAIL_TOKEN_URL = "https://oauth2.googleapis.com/token";
const OUTLOOK_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  
  if (!code || !stateParam) {
    return new Response("Missing authorization code or state", { status: 400 });
  }

  try {
    // Décoder l'état pour récupérer user_id et provider
    const { user_id, provider } = JSON.parse(stateParam);
    
    if (!user_id || !provider) {
      return new Response("Invalid state parameter", { status: 400 });
    }

    // Échanger le code contre un token selon le provider
    let tokenResponse;
    let tokenUrl;
    let tokenBody;

    if (provider === "gmail") {
      tokenUrl = GMAIL_TOKEN_URL;
      tokenBody = new URLSearchParams({
        code,
        client_id: GMAIL_CLIENT_ID,
        client_secret: GMAIL_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
      });
    } else if (provider === "outlook") {
      tokenUrl = OUTLOOK_TOKEN_URL;
      tokenBody = new URLSearchParams({
        code,
        client_id: OUTLOOK_CLIENT_ID,
        client_secret: OUTLOOK_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
      });
    } else {
      return new Response("Invalid provider", { status: 400 });
    }

    tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      body: tokenBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange error:", errorData);
      return new Response(`Failed to exchange code: ${errorData}`, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    
    // On stockerait normalement les tokens de manière sécurisée 
    // Pour l'instant, on met simplement à jour le statut email_synced
    const { error } = await supabase
      .from("profiles")
      .update({ email_synced: true })
      .eq("id", user_id);

    if (error) {
      console.error("Supabase update error:", error);
      return new Response(`Failed to update user profile: ${error.message}`, { status: 500 });
    }

    // Rediriger vers le dashboard avec un paramètre de succès
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard?email_connected=true&provider=" + provider
      }
    });
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    return new Response(`OAuth callback error: ${error.message}`, { status: 500 });
  }
};

serve(handler);
