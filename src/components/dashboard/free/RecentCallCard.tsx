
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface RecentCallCardProps {
  hasRecentCall: boolean;
  isLoading?: boolean;
  call?: {
    id: string;
    clientName: string;
    duration: number;
    date: string;
    summary: string;
  };
  onLoadMore?: () => void;
}

const RecentCallCard = ({ 
  hasRecentCall, 
  isLoading = false,
  call,
  onLoadMore
}: RecentCallCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="pb-2 space-y-2">
          <div className="flex justify-between mb-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-16 w-full" />
        </CardContent>
        <CardFooter className="flex gap-2 pt-0">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!hasRecentCall) return null;
  
  return (
    <Card 
      className="animate-slide-up transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.08)' : '' }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Votre dernier résumé</h3>
          {onLoadMore && (
            <Button variant="ghost" size="sm" className="gap-1 text-nexentry-blue" onClick={onLoadMore}>
              Plus <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between mb-1">
          <span className="font-medium">{call?.clientName || 'Pierre Durand'}</span>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {call?.duration || 18} min • {call?.date || 'Hier'}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
          {call?.summary || 'Discussion sur le nouveau contrat SaaS. Le client souhaite ajouter 5 licences supplémentaires et organiser une démo pour l\'équipe marketing.'}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/call-summary/${call?.id || '123'}`}>Voir résumé</Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1 hover:bg-blue-50 hover:text-blue-600 transition-colors">
          <Send className="h-4 w-4" /> Relancer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentCallCard;
