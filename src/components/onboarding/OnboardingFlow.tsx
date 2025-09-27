import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, User, Target, Zap, ArrowRight, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [userRole, setUserRole] = useState<'sdr' | 'bdr' | 'sales_manager' | 'entrepreneur'>('sdr');
  const [goals, setGoals] = useState<string[]>([]);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  const steps = [
    { title: "Bienvenue", icon: User },
    { title: "Votre rôle", icon: Target },
    { title: "Vos objectifs", icon: Zap },
    { title: "Données de démo", icon: Play }
  ];

  const roleOptions = [
    { id: 'sdr', label: 'SDR (Sales Development Rep)', description: 'Génération de leads et qualification' },
    { id: 'bdr', label: 'BDR (Business Development Rep)', description: 'Développement business et partenariats' },
    { id: 'sales_manager', label: 'Sales Manager', description: 'Management d\'équipe commerciale' },
    { id: 'entrepreneur', label: 'Entrepreneur/Dirigeant', description: 'Dirigeant d\'entreprise' }
  ];

  const goalOptions = [
    'Améliorer le taux de réponse aux emails',
    'Réduire le temps de suivi post-appel',
    'Automatiser les follow-ups',
    'Augmenter le taux de conversion',
    'Mieux organiser le pipeline',
    'Optimiser les templates d\'emails',
    'Analyser les performances commerciales',
    'Intégrer avec le CRM existant'
  ];

  const createDemoData = async () => {
    if (!user) return;

    setIsCreatingDemo(true);
    
    try {
      // Create demo clients
      const demoClients = [
        {
          user_id: user.id,
          name: 'Sophie Martin',
          email: 'sophie.martin@techcorp.fr',
          phone: '+33 6 12 34 56 78',
          company: 'TechCorp Solutions',
          status: 'intéressé',
          value: 5000,
          notes: 'Intéressée par notre solution CRM. Budget alloué pour Q1.'
        },
        {
          user_id: user.id,
          name: 'Marc Dubois',
          email: 'marc.dubois@innovate.com',
          phone: '+33 6 87 65 43 21',
          company: 'Innovate Digital',
          status: 'en attente',
          value: 12000,
          notes: 'En attente de validation budget. Décision prévue fin du mois.'
        },
        {
          user_id: user.id,
          name: 'Claire Rousseau',
          email: 'claire@startup.io',
          phone: '+33 6 11 22 33 44',
          company: 'StartupFlow',
          status: 'lead',
          value: 3000,
          notes: 'Premier contact établi. À recontacter la semaine prochaine.'
        }
      ];

      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .insert(demoClients)
        .select();

      if (clientsError) throw clientsError;

      // Create demo calls
      const demoCalls = [
        {
          user_id: user.id,
          client_id: clients[0].id,
          duration: 25,
          status: 'completed',
          summary: 'Discussion sur les besoins CRM. Cliente très intéressée par l\'automatisation des follow-ups.',
          notes: 'À recontacter avec une démonstration personnalisée.'
        },
        {
          user_id: user.id,
          client_id: clients[1].id,
          duration: 18,
          status: 'completed',
          summary: 'Présentation générale de notre solution. Client demande plus de détails sur le ROI.',
          notes: 'Préparer étude de cas avec des métriques précises.'
        }
      ];

      const { error: callsError } = await supabase
        .from('calls')
        .insert(demoCalls);

      if (callsError) throw callsError;

      // Update user profile
      await supabase
        .from('profiles')
        .update({
          role: userRole,
          preferences: {
            goals: goals,
            onboarding_completed: true,
            demo_data_created: true
          }
        })
        .eq('user_id', user.id);

      toast({
        title: "Bienvenue dans Nexentry!",
        description: "Vos données de démo ont été créées. Vous pouvez commencer à utiliser l'application.",
      });

      onComplete();

    } catch (error) {
      console.error('Error creating demo data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer les données de démo",
        variant: "destructive"
      });
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      createDemoData();
    }
  };

  const toggleGoal = (goal: string) => {
    setGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-semibold">Nexentry</span>
            </div>
            <Badge variant="outline">
              Étape {currentStep + 1} sur {steps.length}
            </Badge>
          </div>
          
          <Progress value={progress} className="w-full mb-6" />
          
          <CardTitle className="flex items-center gap-2">
            {steps[currentStep].icon && <steps[currentStep].icon className="h-6 w-6" />}
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {currentStep === 0 && (
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Bienvenue dans Nexentry!</h2>
                <p className="text-muted-foreground text-lg">
                  Votre assistant IA pour transformer vos conversations en actions concrètes
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Ce que vous allez accomplir:</h3>
                <ul className="text-sm space-y-1 text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Créer votre premier résumé IA en moins de 10 minutes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Envoyer votre premier follow-up automatisé
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Découvrir comment améliorer vos taux de réponse
                  </li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quel est votre rôle?</h3>
                <p className="text-muted-foreground mb-4">
                  Cela nous aide à personnaliser votre expérience
                </p>
              </div>
              
              <div className="grid gap-3">
                {roleOptions.map((role) => (
                  <div
                    key={role.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      userRole === role.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setUserRole(role.id as any)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{role.label}</h4>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      {userRole === role.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quels sont vos objectifs?</h3>
                <p className="text-muted-foreground mb-4">
                  Sélectionnez ce que vous souhaitez améliorer (plusieurs choix possibles)
                </p>
              </div>
              
              <div className="grid gap-2">
                {goalOptions.map((goal) => (
                  <div
                    key={goal}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      goals.includes(goal)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleGoal(goal)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{goal}</span>
                      {goals.includes(goal) && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Play className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Créer vos données de démonstration</h3>
                <p className="text-muted-foreground">
                  Nous allons créer quelques clients et appels d'exemple pour que vous puissiez découvrir toutes les fonctionnalités immédiatement.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h4 className="font-medium mb-2">Ce qui sera créé:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    3 clients prospects avec différents statuts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    2 appels d'exemple avec résumés
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Templates d'emails et SMS personnalisés
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Précédent
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !userRole) ||
                (currentStep === 2 && goals.length === 0) ||
                isCreatingDemo
              }
            >
              {currentStep === steps.length - 1 ? (
                isCreatingDemo ? (
                  'Création en cours...'
                ) : (
                  'Créer mes données de démo'
                )
              ) : (
                <>
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;