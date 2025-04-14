
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, User } from 'lucide-react';

const RecentClientsCard = () => {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Clients récents</h3>
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
            <div className="bg-nexentry-blue-light/20 rounded-full p-2">
              <User className="h-5 w-5 text-nexentry-blue" />
            </div>
            <div>
              <p className="font-medium">Marie Legrand</p>
              <p className="text-sm text-gray-500">Dernier contact: 2 jours</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-nexentry-blue">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="bg-nexentry-blue-light/20 rounded-full p-2">
              <User className="h-5 w-5 text-nexentry-blue" />
            </div>
            <div>
              <p className="font-medium">Thomas Bernard</p>
              <p className="text-sm text-gray-500">Dernier contact: 5 jours</p>
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

export default RecentClientsCard;
