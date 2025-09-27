import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2, Clock, CheckCircle, Copy, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import SMSComposer from '@/components/sms/SMSComposer';

interface AISummaryWizardProps {
  callId?: string;
  clientId?: string;
  onSummaryComplete?: (summaryId: string) => void;
}

const AISummaryWizard = ({ callId, clientId, onSummaryComplete }: AISummaryWizardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState({
    content: '',
    keyPoints: [] as string[],
    nextSteps: [] as string[],
    tone: 'neutre' as 'formel' | 'neutre' | 'amical',
    tags: [] as string[]
  });
  const [editingField, setEditingField] = useState<string | null>(null);

  const steps = [
    'Analyse de l\'appel',
    'Génération du résumé',
    'Édition et validation',
    'Actions de suivi'
  ];

  const startAnalysis = async () => {
    if (!user || !callId) return;
    
    setIsGenerating(true);
    setCurrentStep(1);
    
    try {
      // Simulate AI analysis progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Generate mock AI summary
      const mockSummary = {
        content: "Appel de découverte avec le client pour comprendre ses besoins en terme de CRM. Le client recherche une solution pour automatiser ses follow-ups et améliorer sa productivité commerciale.",
        keyPoints: [
          "Budget alloué: 5000€/mois",
          "Équipe de 10 commerciaux",
          "Problème actuel: follow-ups manuels chronophages",
          "Objectif: +30% de taux de conversion"
        ],
        nextSteps: [
          "Envoyer proposition commerciale sous 48h",
          "Planifier démo produit la semaine prochaine",
          "Préparer étude de cas similaires"
        ],
        tone: 'neutre' as const,
        tags: ['découverte', 'crm', 'budget-moyen']
      };

      setSummary(mockSummary);
      setCurrentStep(2);
      
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le résumé IA",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveSummary = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_summaries')
        .insert({
          user_id: user.id,
          call_id: callId,
          client_id: clientId,
          content: summary.content,
          key_points: summary.keyPoints,
          next_steps: summary.nextSteps,
          tags: summary.tags,
          tone: summary.tone,
          confidence_score: 0.95
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Résumé sauvegardé",
        description: "Le résumé IA a été enregistré avec succès",
      });

      setCurrentStep(3);
      onSummaryComplete?.(data.id);

    } catch (error) {
      console.error('Error saving summary:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le résumé",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Le contenu a été copié dans le presse-papier",
    });
  };

  if (currentStep === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Assistant IA - Résumé d'appel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Wand2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Prêt à analyser votre appel</h3>
              <p className="text-muted-foreground">
                L'IA va analyser votre conversation et générer un résumé structuré avec les points clés et les prochaines étapes.
              </p>
            </div>
            <Button onClick={startAnalysis} className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              Démarrer l'analyse IA
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 1) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 animate-spin" />
            Analyse en cours...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>Analyse en cours...</span>
            </div>
            <Progress value={75} className="w-full" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Transcription audio analysée</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Points clés identifiés</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-500 animate-spin" />
              <span>Génération des prochaines étapes...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 2) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Résumé généré - Validation
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">Confiance: 95%</Badge>
            <Badge variant="outline">Modèle: GPT-4</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tone Selector */}
          <div>
            <Label>Ton du résumé</Label>
            <Select value={summary.tone} onValueChange={(value) => setSummary({...summary, tone: value as any})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formel">Formel</SelectItem>
                <SelectItem value="neutre">Neutre</SelectItem>
                <SelectItem value="amical">Amical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Résumé de l'appel</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(summary.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {editingField === 'content' ? (
              <div className="space-y-2">
                <Textarea
                  value={summary.content}
                  onChange={(e) => setSummary({...summary, content: e.target.value})}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setEditingField(null)}>Valider</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>Annuler</Button>
                </div>
              </div>
            ) : (
              <div 
                className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                onClick={() => setEditingField('content')}
              >
                {summary.content}
              </div>
            )}
          </div>

          {/* Key Points */}
          <div>
            <Label>Points clés</Label>
            <div className="space-y-2 mt-2">
              {summary.keyPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="flex-1">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <Label>Prochaines étapes</Label>
            <div className="space-y-2 mt-2">
              {summary.nextSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="flex-1">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {summary.tags.map((tag, index) => (
                <Badge key={index} variant="outline">#{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveSummary} className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider et sauvegarder
            </Button>
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Régénérer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 3) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Actions de suivi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Follow-up */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email de suivi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded text-sm">
                    <strong>Objet:</strong> Suite à notre échange d'aujourd'hui
                  </div>
                  <div className="p-3 bg-muted rounded text-sm">
                    Bonjour,<br/><br/>
                    Merci pour le temps accordé aujourd'hui. Voici un résumé de notre échange...<br/><br/>
                    Prochaines étapes:<br/>
                    • Envoi de la proposition commerciale<br/>
                    • Planification d'une démo<br/><br/>
                    Cordialement
                  </div>
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SMS Follow-up */}
            <SMSComposer clientId={clientId} />
          </div>

          {/* Schedule Next Step */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Planifier la prochaine étape</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Planifier un rendez-vous
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default AISummaryWizard;