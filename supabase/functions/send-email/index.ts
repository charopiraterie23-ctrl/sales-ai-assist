
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
    
    // Vérifier si l'utilisateur a un compte email connecté
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("email_synced")
      .eq("id", emailData.summaries.calls.user_id)
      .single();
    
    if (userError || !userData) {
      console.error("User not found:", userError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!userData.email_synced) {
      return new Response(
        JSON.stringify({ error: "Email account not connected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Simulation d'envoi d'email (dans une vraie implémentation, nous utiliserions Gmail API ou Outlook API)
    console.log(`Sending email to ${emailData.to_email} with subject: ${emailData.subject}`);
    
    // Dans une implémentation réelle, nous utiliserions un service comme Resend, SendGrid, etc.
    // ou les API de Gmail/Outlook après authentification OAuth
    
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
