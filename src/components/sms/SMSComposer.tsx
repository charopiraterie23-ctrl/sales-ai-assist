import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SMSComposerProps {
  clientId?: string;
  defaultPhone?: string;
  onSent?: () => void;
}

const SMS_TEMPLATES = [
  {
    name: "Suivi de rendez-vous",
    message: "Bonjour {nom}, merci pour notre échange d'aujourd'hui. N'hésitez pas à me recontacter si vous avez des questions. Cordialement."
  },
  {
    name: "Rappel de proposition",
    message: "Bonjour {nom}, j'espère que vous allez bien. Je reviens vers vous concernant notre proposition. Avez-vous eu l'occasion de l'examiner ?"
  },
  {
    name: "Première prise de contact",
    message: "Bonjour {nom}, merci pour votre intérêt. Je reste à votre disposition pour répondre à vos questions et planifier un rendez-vous."
  }
];

const SMSComposer = ({ clientId, defaultPhone = '', onSent }: SMSComposerProps) => {
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleTemplateSelect = (template: typeof SMS_TEMPLATES[0]) => {
    setMessage(template.message);
  };

  const handleSend = async () => {
    if (!phone.trim() || !message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le numéro de téléphone et le message",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: phone,
          message: message,
          clientId: clientId
        }
      });

      if (error) throw error;

      toast({
        title: "SMS envoyé",
        description: "Votre message a été envoyé avec succès",
        variant: "default"
      });

      setMessage('');
      onSent?.();

    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le SMS. Vérifiez votre configuration.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const remainingChars = 160 - message.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Envoyer un SMS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="phone">Numéro de téléphone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <Label>Modèles rapides</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {SMS_TEMPLATES.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleTemplateSelect(template)}
                type="button"
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Saisissez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={160}
          />
          <div className="text-sm text-muted-foreground mt-1">
            {remainingChars} caractères restants
          </div>
        </div>

        <Button 
          onClick={handleSend} 
          disabled={isSending || !phone.trim() || !message.trim()}
          className="w-full"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Envoyer SMS
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SMSComposer;