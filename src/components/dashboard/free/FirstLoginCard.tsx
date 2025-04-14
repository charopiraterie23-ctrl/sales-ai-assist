
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FirstLoginCard = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default FirstLoginCard;
