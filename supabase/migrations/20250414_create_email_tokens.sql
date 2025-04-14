
-- Table pour stocker les tokens OAuth pour l'envoi d'emails
CREATE TABLE IF NOT EXISTS public.email_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook')),
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  email TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Politiques RLS pour limiter l'accès aux tokens
ALTER TABLE public.email_tokens ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir uniquement leurs propres tokens
CREATE POLICY "Users can view their own email tokens"
  ON public.email_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs ne peuvent pas modifier directement les tokens (géré par les fonctions)
