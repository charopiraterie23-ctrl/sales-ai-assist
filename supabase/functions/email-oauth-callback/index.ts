
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Les identifiants sont récupérés depuis les variables d'environnement
const GMAIL_CLIENT_ID = Deno.env.get("GMAIL_CLIENT_ID") || "";
const GMAIL_CLIENT_SECRET = Deno.env.get("GMAIL_CLIENT_SECRET") || "";
const OUTLOOK_CLIENT_ID = Deno.env.get("OUTLOOK_CLIENT_ID") || "";
const OUTLOOK_CLIENT_SECRET = Deno.env.get("OUTLOOK_CLIENT_SECRET") || "";
const REDIRECT_URI = Deno.env.get("EMAIL_OAUTH_REDIRECT_URI") || "";

// Vérification des variables d'environnement requises
if (!GMAIL_CLIENT_ID) console.warn("ATTENTION: GMAIL_CLIENT_ID non défini dans les variables d'environnement");
if (!GMAIL_CLIENT_SECRET) console.warn("ATTENTION: GMAIL_CLIENT_SECRET non défini dans les variables d'environnement");
if (!OUTLOOK_CLIENT_ID) console.warn("ATTENTION: OUTLOOK_CLIENT_ID non défini dans les variables d'environnement");
if (!OUTLOOK_CLIENT_SECRET) console.warn("ATTENTION: OUTLOOK_CLIENT_SECRET non défini dans les variables d'environnement");
if (!REDIRECT_URI) console.warn("ATTENTION: EMAIL_OAUTH_REDIRECT_URI non défini dans les variables d'environnement");

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
  const errorParam = url.searchParams.get("error");
  
  console.log("OAuth callback reçu:", { 
    code: code ? (code.substring(0, 5) + "...") : null, 
    state: stateParam, 
    error: errorParam 
  });
  
  if (errorParam) {
    console.error("Erreur OAuth:", errorParam);
    return new Response(
      `<html>
        <head>
          <title>Erreur d'authentification</title>
          <meta http-equiv="refresh" content="5;url=/dashboard?email_error=${encodeURIComponent(errorParam)}">
        </head>
        <body>
          <h2>Erreur d'authentification</h2>
          <p>Erreur: ${errorParam}</p>
          <p>Redirection vers le dashboard...</p>
        </body>
      </html>`,
      {
        status: 400,
        headers: {
          "Content-Type": "text/html"
        }
      }
    );
  }
  
  if (!code || !stateParam) {
    console.error("Code d'autorisation ou état manquant");
    return new Response(
      `<html>
        <head>
          <title>Erreur de paramètres</title>
          <meta http-equiv="refresh" content="5;url=/dashboard?email_error=missing_params">
        </head>
        <body>
          <h2>Paramètres manquants</h2>
          <p>Le code d'autorisation ou l'état est manquant</p>
          <p>Redirection vers le dashboard...</p>
        </body>
      </html>`,
      { 
        status: 400,
        headers: {
          "Content-Type": "text/html"
        }
      }
    );
  }

  try {
    // Décoder l'état pour récupérer user_id et provider
    let user_id, provider;
    try {
      const stateObj = JSON.parse(stateParam);
      user_id = stateObj.user_id;
      provider = stateObj.provider;
    } catch (e) {
      console.error("Erreur de décodage de l'état:", e);
      return new Response("Format d'état invalide", { 
        status: 400,
        headers: {
          "Content-Type": "text/html"
        }
      });
    }
    
    console.log("État décodé:", { user_id, provider });
    
    if (!user_id || !provider) {
      return new Response(
        `<html>
          <head>
            <title>Erreur de paramètres</title>
            <meta http-equiv="refresh" content="5;url=/dashboard?email_error=invalid_state">
          </head>
          <body>
            <h2>Paramètres d'état invalides</h2>
            <p>Redirection vers le dashboard...</p>
          </body>
        </html>`,
        { 
          status: 400,
          headers: {
            "Content-Type": "text/html"
          }
        }
      );
    }

    // Vérifier que les identifiants clients sont définis pour le provider demandé
    if ((provider === "gmail" && (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET)) || 
        (provider === "outlook" && (!OUTLOOK_CLIENT_ID || !OUTLOOK_CLIENT_SECRET))) {
      const missingCreds = provider === "gmail" 
        ? (!GMAIL_CLIENT_ID ? "GMAIL_CLIENT_ID" : "GMAIL_CLIENT_SECRET") 
        : (!OUTLOOK_CLIENT_ID ? "OUTLOOK_CLIENT_ID" : "OUTLOOK_CLIENT_SECRET");
      
      console.error(`Identifiants manquants pour ${provider}: ${missingCreds}`);
      return new Response(
        `<html>
          <head>
            <title>Erreur de configuration</title>
            <meta http-equiv="refresh" content="5;url=/dashboard?email_error=missing_credentials">
          </head>
          <body>
            <h2>Erreur de configuration</h2>
            <p>Identifiants manquants pour ${provider}</p>
            <p>Redirection vers le dashboard...</p>
          </body>
        </html>`,
        { 
          status: 500,
          headers: {
            "Content-Type": "text/html"
          }
        }
      );
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
      return new Response("Provider invalide", { 
        status: 400,
        headers: {
          "Content-Type": "text/html"
        }
      });
    }

    console.log(`Échange du code contre un token avec ${provider}`);
    
    const response = await fetch(tokenUrl, {
      method: "POST",
      body: tokenBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Erreur d'échange de token (${response.status}):`, errorData);
      return new Response(
        `<html>
          <head>
            <title>Erreur d'échange de token</title>
            <meta http-equiv="refresh" content="5;url=/dashboard?email_error=token_exchange_failed&code=${response.status}">
          </head>
          <body>
            <h2>Échec de l'échange de token</h2>
            <p>Erreur: ${response.status}</p>
            <p>Redirection vers le dashboard...</p>
          </body>
        </html>`,
        { 
          status: response.status,
          headers: {
            "Content-Type": "text/html"
          }
        }
      );
    }

    const tokenData: TokenResponse = await response.json();
    console.log(`Token obtenu avec succès depuis ${provider}`);
    
    // Calculer l'expiration du token
    const now = new Date();
    const expiresAt = new Date(now.getTime() + tokenData.expires_in * 1000);
    
    // Vérifier si la table email_tokens existe
    try {
      const { error: tableCheckError } = await supabase
        .from("email_tokens")
        .select("user_id", { count: "exact", head: true });

      if (tableCheckError && tableCheckError.code === "42P01") {
        console.error("La table email_tokens n'existe pas. Création nécessaire.");
        return new Response(
          `<html>
            <head>
              <title>Erreur de configuration</title>
              <meta http-equiv="refresh" content="5;url=/dashboard?email_error=table_not_exists">
            </head>
            <body>
              <h2>Erreur de configuration</h2>
              <p>La table email_tokens n'existe pas. Veuillez contacter l'administrateur.</p>
              <p>Redirection vers le dashboard...</p>
            </body>
          </html>`,
          { 
            status: 500,
            headers: {
              "Content-Type": "text/html"
            }
          }
        );
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la table:", error);
    }

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
      console.error("Erreur de stockage Supabase des tokens:", tokenError);
      return new Response(
        `<html>
          <head>
            <title>Erreur de stockage</title>
            <meta http-equiv="refresh" content="5;url=/dashboard?email_error=token_storage_failed">
          </head>
          <body>
            <h2>Échec du stockage des tokens</h2>
            <p>Erreur: ${tokenError.message}</p>
            <p>Redirection vers le dashboard...</p>
          </body>
        </html>`,
        { 
          status: 500,
          headers: {
            "Content-Type": "text/html"
          }
        }
      );
    }

    // Mettre à jour le profil utilisateur
    const { error } = await supabase
      .from("profiles")
      .update({ email_synced: true })
      .eq("id", user_id);

    if (error) {
      console.error("Erreur de mise à jour du profil Supabase:", error);
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
        console.log(`Email Gmail récupéré: ${userEmail}`);
      } else {
        console.error("Échec de récupération des infos utilisateur depuis Gmail");
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
        console.log(`Email Outlook récupéré: ${userEmail}`);
      } else {
        console.error("Échec de récupération des infos utilisateur depuis Outlook");
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
    console.log("Redirection vers le dashboard avec paramètres de succès");
    return new Response(
      `<html>
        <head>
          <meta http-equiv="refresh" content="0;url=/dashboard?email_connected=true&provider=${provider}">
          <title>Connexion réussie</title>
        </head>
        <body>
          <p>Connexion réussie! Redirection en cours...</p>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html"
        }
      }
    );
    
  } catch (error) {
    console.error("Erreur de callback OAuth:", error);
    return new Response(
      `<html>
        <head>
          <title>Erreur de traitement</title>
          <meta http-equiv="refresh" content="5;url=/dashboard?email_error=processing_error">
        </head>
        <body>
          <h2>Erreur de traitement</h2>
          <p>Erreur: ${error.message}</p>
          <p>Redirection vers le dashboard...</p>
        </body>
      </html>`,
      { 
        status: 500,
        headers: {
          "Content-Type": "text/html"
        }
      }
    );
  }
};

serve(handler);
