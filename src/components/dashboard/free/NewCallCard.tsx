
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Upload, Play, PauseCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface NewCallCardProps {
  customButtonLabel?: string;
  showIconsOnly?: boolean;
  className?: string;
}

const NewCallCard = ({ 
  customButtonLabel, 
  showIconsOnly = false,
  className = ""
}: NewCallCardProps) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  
  const buttonLabel = customButtonLabel || 'Uploader ou enregistrer un appel';
  
  return (
    <Card className={`animate-slide-up ${className}`}>
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
          {!showIconsOnly && buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewCallCard;
