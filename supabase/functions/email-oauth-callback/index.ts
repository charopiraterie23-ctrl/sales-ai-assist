
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

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

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

    const response = await fetch(tokenUrl, {
      method: "POST",
      body: tokenBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Token exchange error:", errorData);
      return new Response(`Failed to exchange code: ${errorData}`, { status: response.status });
    }

    const tokenData: TokenResponse = await response.json();
    
    // Calculer l'expiration du token
    const now = new Date();
    const expiresAt = new Date(now.getTime() + tokenData.expires_in * 1000);
    
    // Insérer ou mettre à jour les tokens dans la base de données
    const { error: tokenError } = await supabase
      .from("email_tokens")
      .upsert({
        user_id,
        provider,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString()
      }, {
        onConflict: 'user_id, provider'
      });

    if (tokenError) {
      console.error("Supabase token storage error:", tokenError);
      return new Response(`Failed to store tokens: ${tokenError.message}`, { status: 500 });
    }

    // Mettre à jour le profil utilisateur
    const { error } = await supabase
      .from("profiles")
      .update({ email_synced: true })
      .eq("id", user_id);

    if (error) {
      console.error("Supabase profile update error:", error);
      return new Response(`Failed to update user profile: ${error.message}`, { status: 500 });
    }

    // Récupérer l'email de l'utilisateur pour le provider
    let userEmail = null;
    
    if (provider === "gmail") {
      const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      });
      
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        userEmail = userInfo.email;
      }
    } else if (provider === "outlook") {
      const userInfoResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      });
      
      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();
        userEmail = userInfo.mail || userInfo.userPrincipalName;
      }
    }
    
    // Stocker l'email du provider si disponible
    if (userEmail) {
      await supabase
        .from("email_tokens")
        .update({ email: userEmail })
        .match({ user_id, provider });
    }

    // Rediriger vers le dashboard avec un paramètre de succès
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/dashboard?email_connected=true&provider=${provider}`
      }
    });
    
  } catch (error) {
    console.error("OAuth callback error:", error);
    return new Response(`OAuth callback error: ${error.message}`, { status: 500 });
  }
};

serve(handler);
