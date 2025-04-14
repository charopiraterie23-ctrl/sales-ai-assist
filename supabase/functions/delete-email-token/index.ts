
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface DeleteEmailTokenRequest {
  user_id: string;
  provider: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, provider }: DeleteEmailTokenRequest = await req.json();
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Vérifier si la table email_tokens existe
    const { data: tableExists, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'email_tokens')
      .single();
    
    if (checkError || !tableExists) {
      // Si la table n'existe pas, renvoyer un succès
      console.log('La table email_tokens n\'existe pas encore');
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Si la table existe, supprimer le token
    const { error } = await supabase
      .from('email_tokens')
      .delete()
      .eq('user_id', user_id)
      .eq('provider', provider);
    
    if (error) {
      console.error('Erreur lors de la suppression du token:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Vérifier s'il reste des comptes connectés
    const { data: remainingTokens, error: countError } = await supabase
      .from('email_tokens')
      .select('id')
      .eq('user_id', user_id);
    
    if (!countError && (!remainingTokens || remainingTokens.length === 0)) {
      // Si aucun compte n'est connecté, mettre à jour email_synced à false
      await supabase
        .from('profiles')
        .update({ email_synced: false })
        .eq('id', user_id);
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in delete-email-token function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
