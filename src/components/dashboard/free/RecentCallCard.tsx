
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface RecentCallCardProps {
  hasRecentCall: boolean;
}

const RecentCallCard = ({ hasRecentCall }: RecentCallCardProps) => {
  if (!hasRecentCall) return null;
  
  return (
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
  );
};

export default RecentCallCard;
