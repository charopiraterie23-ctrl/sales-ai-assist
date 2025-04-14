
-- Fonction pour récupérer les tokens email de l'utilisateur
CREATE OR REPLACE FUNCTION public.get_email_tokens(user_uuid UUID)
RETURNS TABLE(provider TEXT, email TEXT) AS $$
BEGIN
  -- Vérifier si la table email_tokens existe
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'email_tokens'
  ) THEN
    RETURN QUERY 
    SELECT et.provider, et.email
    FROM public.email_tokens et
    WHERE et.user_id = user_uuid;
  ELSE
    -- Retourner un ensemble vide si la table n'existe pas
    RETURN QUERY SELECT NULL::TEXT, NULL::TEXT WHERE FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour supprimer un token email
CREATE OR REPLACE FUNCTION public.delete_email_token(user_uuid UUID, provider_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN := FALSE;
BEGIN
  -- Vérifier si la table email_tokens existe
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'email_tokens'
  ) THEN
    -- Supprimer le token
    DELETE FROM public.email_tokens
    WHERE user_id = user_uuid AND provider = provider_name;
    
    -- Vérifier s'il reste des comptes connectés
    IF NOT EXISTS (
      SELECT 1 FROM public.email_tokens
      WHERE user_id = user_uuid
    ) THEN
      -- Si aucun compte n'est connecté, mettre à jour email_synced à false
      UPDATE public.profiles
      SET email_synced = FALSE
      WHERE id = user_uuid;
    END IF;
    
    success := TRUE;
  END IF;
  
  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
