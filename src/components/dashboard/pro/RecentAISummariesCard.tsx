
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Tag } from 'lucide-react';

const RecentAISummariesCard = () => {
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
  );
};

export default RecentAISummariesCard;
