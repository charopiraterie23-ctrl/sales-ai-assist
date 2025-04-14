
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Upload, ChevronRight, Send, User, Phone, Settings, Mail } from 'lucide-react';

interface FreeDashboardContentProps {
  isFirstLogin: boolean;
  hasRecentCall: boolean;
  navigate: ReturnType<typeof useNavigate>;
  tipIndex: number;
  callsUsed: number;
  callsTotal: number;
  usagePercentage: number;
}

const tips = [
  "Saviez-vous que vos relances peuvent être envoyées directement depuis Gmail ?",
  "Ajoutez des tags à vos résumés pour les retrouver plus vite",
  "Partagez vos résumés avec vos collègues en un clic",
  "Utilisez la recherche pour retrouver rapidement vos anciens appels"
];

const FreeDashboardContent = ({ 
  isFirstLogin, 
  hasRecentCall, 
  navigate, 
  tipIndex, 
  callsUsed, 
  callsTotal, 
  usagePercentage 
}: FreeDashboardContentProps) => {
  return (
    <>
      {/* First Login Welcome Card */}
      {isFirstLogin && (
        <Card className="border-nexentry-blue border-2 bg-nexentry-blue/5 animate-slide-up">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Bienvenue sur nexentry !</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Commencez par enregistrer ou uploader votre premier appel pour découvrir 
              la puissance de notre assistant commercial.
            </p>
            <Button 
              className="w-full bg-nexentry-blue hover:bg-nexentry-blue-dark"
              onClick={() => navigate('/record')}
            >
              Ajouter mon premier appel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Primary Action Card */}
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

      {/* Last Call Summary (if exists) */}
      {hasRecentCall && (
        <Card className="animate-slide-up">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Votre dernier résumé</h3>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Appel avec Pierre Durand</span>
              <span className="text-sm text-gray-500">18 min • Hier</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
              Discussion sur le nouveau contrat SaaS. Le client souhaite ajouter 5 licences supplémentaires et organiser une démo pour l'équipe marketing.
            </p>
          </CardContent>
          <CardFooter className="flex gap-2 pt-0">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/call-summary/123">Voir résumé</Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-1">
              <Send className="h-4 w-4" /> Relancer
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Client Snapshot */}
      <Card className="animate-slide-up">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Clients récents</h3>
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
              <div className="bg-nexentry-blue-light/20 rounded-full p-2">
                <User className="h-5 w-5 text-nexentry-blue" />
              </div>
              <div>
                <p className="font-medium">Marie Legrand</p>
                <p className="text-sm text-gray-500">Dernier contact: 2 jours</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-nexentry-blue">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="bg-nexentry-blue-light/20 rounded-full p-2">
                <User className="h-5 w-5 text-nexentry-blue" />
              </div>
              <div>
                <p className="font-medium">Thomas Bernard</p>
                <p className="text-sm text-gray-500">Dernier contact: 5 jours</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-nexentry-blue">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Usage Block */}
      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Votre utilisation</h3>
            <span className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Plan Gratuit</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Appels traités ce mois-ci</span>
              <span className="font-medium">{callsUsed} / {callsTotal}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/pricing">Passez au plan Pro pour appels illimités</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Smart Tip */}
      <Card className="bg-nexentry-blue-light/10 border-nexentry-blue-light animate-slide-up">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 bg-nexentry-blue-light/20 rounded-full p-2 h-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-nexentry-blue"
              >
                <path d="M12 2a7 7 0 0 1 7 7c0 2.1-.7 3.3-2 4.8L12 19l-5-5.2C5.7 12.3 5 11.1 5 9a7 7 0 0 1 7-7Z" />
                <path d="M12 6v2" />
                <path d="M12 11h.01" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Astuce nexentry</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {tips[tipIndex]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up">
        <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
          <Link to="/clients">
            <User className="h-5 w-5 text-nexentry-blue" />
            <span>Mes clients</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
          <Link to="/calls">
            <Phone className="h-5 w-5 text-nexentry-blue" />
            <span>Mes appels</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
          <Link to="/emails">
            <Mail className="h-5 w-5 text-nexentry-blue" />
            <span>Emails</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
          <Link to="/settings">
            <Settings className="h-5 w-5 text-nexentry-blue" />
            <span>Paramètres</span>
          </Link>
        </Button>
      </div>
    </>
  );
};

export default FreeDashboardContent;
