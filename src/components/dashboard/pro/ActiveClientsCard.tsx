
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, User } from 'lucide-react';

const ActiveClientsCard = () => {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Clients actifs</h3>
          <Button variant="ghost" size="sm" className="gap-1 text-nexentry-blue" asChild>
            <Link to="/clients">
              Voir tous <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Sophie Martin</p>
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs mr-2 bg-green-50 text-green-600 border-green-200">
                  Client
                </Badge>
                <p className="text-xs text-gray-500">Dernier contact: aujourd'hui</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-nexentry-blue">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 rounded-full p-2">
              <User className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium">Marc Dubois</p>
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs mr-2 bg-orange-50 text-orange-600 border-orange-200">
                  En négociation
                </Badge>
                <p className="text-xs text-gray-500">Dernier contact: hier</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-nexentry-blue">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Julie Lambert</p>
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs mr-2 bg-blue-50 text-blue-600 border-blue-200">
                  Prospect
                </Badge>
                <p className="text-xs text-gray-500">Dernier contact: 3 jours</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-nexentry-blue">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveClientsCard;
