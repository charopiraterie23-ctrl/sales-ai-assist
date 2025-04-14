
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewCallCard = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default NewCallCard;
