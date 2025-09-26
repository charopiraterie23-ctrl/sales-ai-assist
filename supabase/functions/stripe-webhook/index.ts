import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16"
    });

    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      throw new Error('Missing stripe signature or webhook secret');
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get customer email from Stripe
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        
        if (customer.email) {
          // Update user profile with subscription info
          const { error } = await supabaseClient
            .from('profiles')
            .update({
              plan: subscription.items.data[0]?.price?.nickname || 'pro',
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status
            })
            .eq('email', customer.email);

          if (error) {
            console.error('Error updating profile:', error);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        
        if (customer.email) {
          const { error } = await supabaseClient
            .from('profiles')
            .update({
              plan: 'free',
              subscription_status: 'canceled'
            })
            .eq('email', customer.email);

          if (error) {
            console.error('Error updating profile:', error);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Log successful payment
        const { error } = await supabaseClient
          .from('payment_logs')
          .insert({
            stripe_invoice_id: invoice.id,
            stripe_customer_id: invoice.customer as string,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error logging payment:', error);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Log failed payment
        const { error } = await supabaseClient
          .from('payment_logs')
          .insert({
            stripe_invoice_id: invoice.id,
            stripe_customer_id: invoice.customer as string,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: 'failed',
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error logging failed payment:', error);
        }
        break;
      }

      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});