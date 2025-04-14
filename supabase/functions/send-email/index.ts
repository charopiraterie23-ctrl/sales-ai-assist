
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface EmailRequest {
  emailId: string;
}

interface EmailToken {
  user_id: string;
  provider: "gmail" | "outlook";
  access_token: string;
  refresh_token: string;
  expires_at: string;
  email?: string;
}

// Fonction pour créer un email encodé en base64 (format requis par Gmail API)
const createGmailMessage = (to: string, subject: string, body: string, from?: string) => {
  const emailContent = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    body
  ].join("\r\n");

  // Encode en base64 format URL-safe
  return btoa(emailContent)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Fonction pour rafraîchir un token expiré
const refreshToken = async (provider: string, refreshToken: string): Promise<string | null> => {
  try {
    const GMAIL_CLIENT_ID = Deno.env.get("GMAIL_CLIENT_ID") || "";
    const GMAIL_CLIENT_SECRET = Deno.env.get("GMAIL_CLIENT_SECRET") || "";
    const OUTLOOK_CLIENT_ID = Deno.env.get("OUTLOOK_CLIENT_ID") || "";
    const OUTLOOK_CLIENT_SECRET = Deno.env.get("OUTLOOK_CLIENT_SECRET") || "";
    
    let tokenUrl: string;
    let tokenBody: URLSearchParams;
    
    if (provider === "gmail") {
      tokenUrl = "https://oauth2.googleapis.com/token";
      tokenBody = new URLSearchParams({
        client_id: GMAIL_CLIENT_ID,
        client_secret: GMAIL_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      });
    } else if (provider === "outlook") {
      tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
      tokenBody = new URLSearchParams({
        client_id: OUTLOOK_CLIENT_ID,
        client_secret: OUTLOOK_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      });
    } else {
      throw new Error("Invalid provider");
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
      console.error(`Token refresh error (${provider}):`, errorData);
      return null;
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

// Fonction pour envoyer un email via Gmail API
const sendViaGmail = async (accessToken: string, to: string, subject: string, body: string): Promise<boolean> => {
  try {
    const message = createGmailMessage(to, subject, body);
    
    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        raw: message
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gmail API error:", errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error sending via Gmail:", error);
    return false;
  }
};

// Fonction pour envoyer un email via Microsoft Graph API (Outlook)
const sendViaOutlook = async (accessToken: string, to: string, subject: string, body: string): Promise<boolean> => {
  try {
    const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: {
          subject,
          body: {
            contentType: "HTML",
            content: body
          },
          toRecipients: [
            {
              emailAddress: {
                address: to
              }
            }
          ]
        },
        saveToSentItems: true
      })
    });
    
    // Microsoft Graph API retourne 202 Accepted quand succès
    if (response.status !== 202) {
      const errorData = await response.text();
      console.error("Microsoft Graph API error:", errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error sending via Outlook:", error);
    return false;
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { emailId }: EmailRequest = await req.json();
    
    // Récupérer les détails de l'email
    const { data: emailData, error: emailError } = await supabase
      .from("followup_emails")
      .select(`
        id, to_email, subject, body, summary_id,
        summaries!inner(call_id, calls!inner(user_id))
      `)
      .eq("id", emailId)
      .single();
    
    if (emailError || !emailData) {
      console.error("Email not found:", emailError);
      return new Response(
        JSON.stringify({ error: "Email not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const userId = emailData.summaries.calls.user_id;
    
    // Récupérer les tokens OAuth de l'utilisateur
    const { data: tokenData, error: tokenError } = await supabase
      .from("email_tokens")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();
    
    if (tokenError || !tokenData) {
      console.error("No email token found:", tokenError);
      return new Response(
        JSON.stringify({ error: "Email account not connected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const emailToken = tokenData as EmailToken;
    let accessToken = emailToken.access_token;
    
    // Vérifier si le token a expiré et le rafraîchir si nécessaire
    const now = new Date();
    const expiresAt = new Date(emailToken.expires_at);
    
    if (now > expiresAt) {
      console.log("Token expired, refreshing...");
      const newToken = await refreshToken(emailToken.provider, emailToken.refresh_token);
      
      if (!newToken) {
        return new Response(
          JSON.stringify({ error: "Failed to refresh token" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      accessToken = newToken;
      
      // Mettre à jour le token dans la base de données
      const newExpiresAt = new Date(now.getTime() + 3600 * 1000); // +1 hour
      await supabase
        .from("email_tokens")
        .update({
          access_token: newToken,
          expires_at: newExpiresAt.toISOString(),
          updated_at: now.toISOString()
        })
        .eq("user_id", userId)
        .eq("provider", emailToken.provider);
    }
    
    // Envoyer l'email via le provider approprié
    let success = false;
    
    if (emailToken.provider === "gmail") {
      success = await sendViaGmail(
        accessToken,
        emailData.to_email,
        emailData.subject,
        emailData.body
      );
    } else if (emailToken.provider === "outlook") {
      success = await sendViaOutlook(
        accessToken,
        emailData.to_email,
        emailData.subject,
        emailData.body
      );
    }
    
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Mettre à jour le statut de l'email dans la base de données
    await supabase
      .from("followup_emails")
      .update({
        status: "envoyé",
        send_date: new Date().toISOString()
      })
      .eq("id", emailId);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        email: {
          id: emailData.id,
          to: emailData.to_email,
          subject: emailData.subject
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
