
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Settings } from 'lucide-react';

const QuickLinksGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-3 animate-slide-up">
      <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
        <Link to="/clients">
          <User className="h-5 w-5 text-nexentry-blue" />
          <span>Mes clients</span>
        </Link>
      </Button>
      <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
        <Link to="/calls">
          <Phone className="h-5 w-5 text-nexentry-blue" />
          <span>Mes appels</span>
        </Link>
      </Button>
      <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
        <Link to="/emails">
          <Mail className="h-5 w-5 text-nexentry-blue" />
          <span>Emails</span>
        </Link>
      </Button>
      <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
        <Link to="/settings">
          <Settings className="h-5 w-5 text-nexentry-blue" />
          <span>Paramètres</span>
        </Link>
      </Button>
    </div>
  );
};

export default QuickLinksGrid;
