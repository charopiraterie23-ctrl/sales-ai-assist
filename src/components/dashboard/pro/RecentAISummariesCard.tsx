
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import CallSummaryCard from '../CallSummaryCard';

const RecentAISummariesCard = () => {
  // Données pour les résumés d'appel
  const summaries = [
    {
      clientName: "Appel avec Sophie Martin",
      date: "Aujourd'hui",
      duration: "26 min",
      summary: "Discussion sur l'implémentation du CRM. La cliente souhaite former son équipe avant la fin du mois et a besoin de notre documentation.",
      summaryId: "456",
      tags: [
        { text: "formation", color: "bg-blue-50 text-blue-600 border-blue-200" },
        { text: "documentation", color: "bg-purple-50 text-purple-600 border-purple-200" }
      ]
    },
    {
      clientName: "Appel avec Marc Dubois",
      date: "Hier",
      duration: "18 min",
      summary: "Négociation du renouvellement de contrat. Le client hésite entre notre offre Pro et Premium. Point d'attention sur le budget limité ce trimestre.",
      summaryId: "789",
      tags: [
        { text: "budget", color: "bg-orange-50 text-orange-600 border-orange-200" },
        { text: "renouvellement", color: "bg-green-50 text-green-600 border-green-200" }
      ]
    }
  ];

  return (
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
        {summaries.map((summary, index) => (
          <div key={index} className="border rounded-lg p-4">
            <CallSummaryCard
              title=""
              clientName={summary.clientName}
              date={summary.date}
              duration={summary.duration}
              summary={summary.summary}
              summaryId={summary.summaryId}
              tags={summary.tags}
              showHeader={false}
              showFooter={false}
            />
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="text-xs">Voir résumé</Button>
              <Button variant="outline" size="sm" className="text-xs">Copier dans email</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentAISummariesCard;
