
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FirstLoginCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  highlight?: boolean;
  className?: string;
}

const FirstLoginCard = ({ 
  title = "Bienvenue sur nexentry !",
  description = "Commencez par enregistrer ou uploader votre premier appel pour découvrir la puissance de notre assistant commercial.",
  buttonText = "Ajouter mon premier appel",
  buttonLink = "/record",
  highlight = true,
  className = ""
}: FirstLoginCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className={`${highlight ? 'border-nexentry-blue border-2 bg-nexentry-blue/5' : ''} animate-slide-up ${className}`}>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        <Button 
          className="w-full bg-nexentry-blue hover:bg-nexentry-blue-dark"
          onClick={() => navigate(buttonLink)}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FirstLoginCard;
