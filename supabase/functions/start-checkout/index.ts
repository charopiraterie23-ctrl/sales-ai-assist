
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Extract token from header
    const token = authHeader.replace('Bearer ', '');

    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Parse the request body
    const { planId } = await req.json();
    if (!planId) {
      throw new Error('Missing planId parameter');
    }

    // Updated plans with the new Team plan at $79 and no Free plan
    const plans = {
      '1': { name: 'Essai Pro', stripeProductId: 'prod_trial_pro', trialDays: 7 },
      '2': { name: 'Pro', stripeProductId: 'prod_pro', trialDays: 7 },
      '3': { name: 'Team', stripeProductId: 'prod_team', trialDays: 0 },
      '4': { name: 'Entreprise', stripeProductId: 'prod_enterprise', trialDays: 0 }
    };

    const plan = plans[planId as keyof typeof plans];
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16"
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{ price: plan.stripeProductId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: plan.trialDays ? { trial_period_days: plan.trialDays } : undefined,
      success_url: `${req.headers.get('origin')}/app?welcome`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      locale: 'fr-CA',
      metadata: {
        company_location: 'Montréal, Canada'
      }
    });

    // Return the session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
