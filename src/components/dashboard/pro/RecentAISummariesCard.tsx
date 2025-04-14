
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Tag, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface SummaryData {
  id: string;
  client: string;
  duration: string;
  date: string;
  summary: string;
  tags: string[];
}

const RecentAISummariesCard = () => {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  
  // Données de démonstration
  const summaries: SummaryData[] = [
    {
      id: "1",
      client: "Sophie Martin",
      duration: "26 min",
      date: "Aujourd'hui",
      summary: "Discussion sur l'implémentation du CRM. La cliente souhaite former son équipe avant la fin du mois et a besoin de notre documentation.",
      tags: ["formation", "documentation"]
    },
    {
      id: "2",
      client: "Marc Dubois",
      duration: "18 min",
      date: "Hier",
      summary: "Négociation du renouvellement de contrat. Le client hésite entre notre offre Pro et Premium. Point d'attention sur le budget limité ce trimestre.",
      tags: ["budget", "renouvellement"]
    }
  ];

  const handleCopySummary = (summary: string) => {
    navigator.clipboard.writeText(summary);
    toast.success("Résumé copié dans le presse-papier");
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      formation: "bg-blue-50 text-blue-600 border-blue-200",
      documentation: "bg-purple-50 text-purple-600 border-purple-200",
      budget: "bg-orange-50 text-orange-600 border-orange-200",
      renouvellement: "bg-green-50 text-green-600 border-green-200"
    };
    
    return colors[tag] || "bg-gray-50 text-gray-600 border-gray-200";
  };

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
        {summaries.map((summary) => (
          <div 
            key={summary.id}
            className="border rounded-lg p-4 transition-shadow duration-200"
            style={{ boxShadow: isHovered === summary.id ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none' }}
            onMouseEnter={() => setIsHovered(summary.id)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div className="flex justify-between mb-1">
              <span className="font-medium">Appel avec {summary.client}</span>
              <span className="text-sm text-gray-500">{summary.duration} • {summary.date}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
              {summary.summary}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {summary.tags.map((tag) => (
                <Badge key={tag} variant="outline" className={getTagColor(tag)}>
                  <Tag className="h-3 w-3 mr-1" /> #{tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                asChild
              >
                <Link to={`/call-summary/${summary.id}`}>
                  Voir résumé
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center gap-1"
                onClick={() => handleCopySummary(summary.summary)}
              >
                <Copy className="h-3 w-3" />
                Copier
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentAISummariesCard;
