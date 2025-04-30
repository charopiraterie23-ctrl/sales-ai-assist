
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface NewCallCardProps {
  isLoading?: boolean;
}

const NewCallCard = ({ isLoading = false }: NewCallCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className={`animate-slide-up ${isHovered ? 'shadow-md' : ''} transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Nouveau résumé</h3>
        <Button 
          className="w-full h-16 bg-nexentry-blue hover:bg-nexentry-blue-dark text-base transition-all duration-300"
          onClick={() => navigate('/record')}
          disabled={isLoading}
          style={{ 
            transform: isHovered && !isLoading ? 'translateY(-2px)' : 'translateY(0)',
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Chargement...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              <span>Créer un résumé d'échange</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewCallCard;
