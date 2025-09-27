-- Create SMS logs table for SMS tracking
CREATE TABLE public.sms_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  twilio_sid TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for SMS logs
CREATE POLICY "Users can view their own SMS logs"
ON public.sms_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SMS logs"
ON public.sms_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create payment logs table for Stripe webhooks
CREATE TABLE public.payment_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_invoice_id TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for payment logs
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for payment logs (admin only for now)
CREATE POLICY "Service role can manage payment logs"
ON public.payment_logs
FOR ALL
USING (auth.role() = 'service_role');

-- Add plan and subscription fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT;

-- Create AI summaries table for call summaries
CREATE TABLE public.ai_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  call_id UUID,
  client_id UUID,
  content TEXT NOT NULL,
  key_points JSONB,
  next_steps JSONB,
  tags TEXT[],
  tone TEXT DEFAULT 'neutre',
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for AI summaries
CREATE POLICY "Users can view their own AI summaries"
ON public.ai_summaries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI summaries"
ON public.ai_summaries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI summaries"
ON public.ai_summaries
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI summaries"
ON public.ai_summaries
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for SMS logs updated_at
CREATE TRIGGER update_sms_logs_updated_at
BEFORE UPDATE ON public.sms_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for AI summaries updated_at
CREATE TRIGGER update_ai_summaries_updated_at
BEFORE UPDATE ON public.ai_summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();