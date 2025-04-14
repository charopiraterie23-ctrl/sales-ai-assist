
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NoFollowupCallsAlertProps {
  callCount: number;
}

const NoFollowupCallsAlert = ({ callCount }: NoFollowupCallsAlertProps) => {
  const navigate = useNavigate();
  
  if (callCount <= 0) return null;
  
  return (
    <Alert variant="default" className="bg-amber-50 border-l-4 border-l-amber-500">
      <div className="flex items-start">
        <RefreshCw className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
        <div className="flex-1">
          <AlertDescription className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium">{callCount} appel{callCount > 1 ? 's' : ''} sans relance</h4>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-xs">À traiter</Badge>
              </div>
              <p className="text-sm text-gray-600">Relancez vos clients pour conclure la vente.</p>
            </div>
            <Button 
              variant="outline"
              className="border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-600 hover:shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              onClick={() => navigate('/calls')}
            >
              Voir les appels
            </Button>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default NoFollowupCallsAlert;
