
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CallSummaryCardProps {
  title: string;
  clientName: string;
  date: string;
  duration?: string;
  summary: string;
  summaryId: string;
  tags?: { text: string; color: string }[];
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const CallSummaryCard = ({
  title,
  clientName,
  date,
  duration,
  summary,
  summaryId,
  tags = [],
  showHeader = true,
  showFooter = true,
  className = ""
}: CallSummaryCardProps) => {
  return (
    <Card className={`animate-slide-up ${className}`}>
      {showHeader && (
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
      )}
      <CardContent className="pb-2">
        <div className="flex justify-between mb-1">
          <span className="font-medium">{clientName}</span>
          <span className="text-sm text-gray-500">{duration && `${duration} • `}{date}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
          {summary}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className={cn(tag.color)}>
                <Tag className="h-3 w-3 mr-1" /> #{tag.text}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      {showFooter && (
        <CardFooter className="flex gap-2 pt-0">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/call-summary/${summaryId}`}>Voir résumé</Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <Send className="h-4 w-4" /> Relancer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CallSummaryCard;
