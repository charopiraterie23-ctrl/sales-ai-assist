import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Upload, ChevronRight, Send, User, Phone, Settings, Mail, Calendar, Activity, Zap, Tag } from 'lucide-react';

interface ProDashboardContentProps {
  navigate: ReturnType<typeof useNavigate>;
  tipIndex: number;
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
}

const tips = [
  "Gagnez du temps en taguant vos résumés. Essayez : #priorité #besoin",
  "Utilisez des raccourcis clavier: Alt+N pour un nouvel appel",
  "Personnalisez vos modèles d'emails pour augmenter vos taux de réponse",
  "Exportez vos données clients au format CSV pour vos analyses"
];

const ProDashboardContent = ({ 
  navigate, 
  tipIndex, 
  callsUsed, 
  callsTotal, 
  usagePercentage 
}: ProDashboardContentProps) => {
  // Sample data for Pro dashboard
  const pendingCallsToday = 3;
  const readyEmails = 2;
  const clientsToFollowUp = 4;
  const isEmailConnected = false;

  return (
    <>
      {/* Today's Overview (Action-focused block) */}
      <Card className="border-nexentry-blue border-l-4 animate-slide-up">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3">Aujourd'hui</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-nexentry-blue mb-1">{pendingCallsToday}</div>
              <div className="text-xs text-gray-600">Appels à traiter</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nexentry-blue mb-1">{readyEmails}</div>
              <div className="text-xs text-gray-600">Emails prêts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-nexentry-blue mb-1">{clientsToFollowUp}</div>
              <div className="text-xs text-gray-600">Clients à relancer</div>
            </div>
          </div>
          <Button className="w-full bg-nexentry-blue hover:bg-nexentry-blue-dark">
            <Calendar className="h-4 w-4 mr-2" /> Voir mes actions du jour
          </Button>
        </CardContent>
      </Card>
      
      {/* Primary Action Card - remains the same for all plans */}
      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Nouvel appel</h3>
          <Button 
            className="w-full h-16 bg-nexentry-blue hover:bg-nexentry-blue-dark text-base gap-3"
            onClick={() => navigate('/record')}
          >
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              <Upload className="h-5 w-5" />
            </div>
            Uploader ou enregistrer un appel
          </Button>
        </CardContent>
      </Card>

      {/* Recent AI Summaries */}
      <Card className="animate-slide-up">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Résumés IA récents</h3>
            <Button variant="ghost" size="sm" className="gap-1 text-nexentry-blue" asChild>
              <Link to="/calls">
                Voir tous <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* First summary card */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Appel avec Sophie Martin</span>
              <span className="text-sm text-gray-500">26 min • Aujourd'hui</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
              Discussion sur l'implémentation du CRM. La cliente souhaite former son équipe avant la fin du mois et a besoin de notre documentation.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                <Tag className="h-3 w-3 mr-1" /> #formation
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                <Tag className="h-3 w-3 mr-1" /> #documentation
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">Voir résumé</Button>
              <Button variant="outline" size="sm" className="text-xs">Copier dans email</Button>
            </div>
          </div>
          
          {/* Second summary card */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Appel avec Marc Dubois</span>
              <span className="text-sm text-gray-500">18 min • Hier</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
              Négociation du renouvellement de contrat. Le client hésite entre notre offre Pro et Premium. Point d'attention sur le budget limité ce trimestre.
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                <Tag className="h-3 w-3 mr-1" /> #budget
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <Tag className="h-3 w-3 mr-1" /> #renouvellement
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">Voir résumé</Button>
              <Button variant="outline" size="sm" className="text-xs">Copier dans email</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ready-to-Send Emails */}
      <Card className="animate-slide-up">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Emails prêts à l'envoi</h3>
        </CardHeader>
        <CardContent>
          {isEmailConnected ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="font-medium mb-1">À: Sophie Martin</div>
                <div className="text-sm font-medium mb-1">Sujet: Suivi de notre appel - Documentation CRM</div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  Bonjour Sophie, Suite à notre échange d'aujourd'hui concernant l'implémentation du CRM...
                </p>
                <Button size="sm" className="w-full">
                  <Send className="h-4 w-4 mr-2" /> Envoyer maintenant
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="font-medium mb-1">À: Marc Dubois</div>
                <div className="text-sm font-medium mb-1">Sujet: Options de renouvellement - Offres Pro et Premium</div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  Bonjour Marc, Pour faire suite à notre discussion concernant le renouvellement de votre contrat...
                </p>
                <Button size="sm" className="w-full">
                  <Send className="h-4 w-4 mr-2" /> Envoyer maintenant
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
              <Mail className="h-10 w-10 mx-auto mb-2 text-nexentry-blue opacity-70" />
              <h4 className="font-medium mb-1">Connectez votre compte email</h4>
              <p className="text-sm text-gray-600 mb-3">
                Activez l'envoi direct depuis nexentry en connectant votre compte Gmail ou Outlook
              </p>
              <Button variant="outline" className="w-full">
                Connecter mon compte email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Statistics */}
      <Card className="animate-slide-up">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Vos statistiques</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Appels traités ce mois-ci</span>
              <span className="font-medium">{callsUsed} / {callsTotal}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-nexentry-blue">76%</div>
              <div className="text-xs text-gray-600">Taux de relance</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-xl font-bold text-nexentry-blue">12</div>
              <div className="text-xs text-gray-600">Clients actifs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Clients */}
      <Card className="animate-slide-up">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Clients actifs</h3>
            <Button variant="ghost" size="sm" className="gap-1 text-nexentry-blue" asChild>
              <Link to="/clients">
                Voir tous <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Sophie Martin</p>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs mr-2 bg-green-50 text-green-600 border-green-200">
                    Client
                  </Badge>
                  <p className="text-xs text-gray-500">Dernier contact: aujourd'hui</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-nexentry-blue">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 rounded-full p-2">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium">Marc Dubois</p>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs mr-2 bg-orange-50 text-orange-600 border-orange-200">
                    En négociation
                  </Badge>
                  <p className="text-xs text-gray-500">Dernier contact: hier</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-nexentry-blue">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Julie Lambert</p>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs mr-2 bg-blue-50 text-blue-600 border-blue-200">
                    Prospect
                  </Badge>
                  <p className="text-xs text-gray-500">Dernier contact: 3 jours</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-nexentry-blue">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Premium Rotating Tip */}
      <Card className="bg-nexentry-blue-light/10 border-nexentry-blue-light animate-slide-up">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 bg-nexentry-blue-light/20 rounded-full p-2 h-fit">
              <Zap className="h-5 w-5 text-nexentry-blue" />
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Astuce Pro</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {tips[tipIndex]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shortcut Grid */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up">
        <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
          <Link to="/record">
            <Upload className="h-5 w-5 text-nexentry-blue" />
            <span>Uploader un appel</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
          <Link to="/calls">
            <Activity className="h-5 w-5 text-nexentry-blue" />
            <span>Résumés IA</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
          <Link to="/emails">
            <Mail className="h-5 w-5 text-nexentry-blue" />
            <span>Emails</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
          <Link to="/clients">
            <User className="h-5 w-5 text-nexentry-blue" />
            <span>Clients</span>
          </Link>
        </Button>
      </div>
    </>
  );
};

export default ProDashboardContent;
