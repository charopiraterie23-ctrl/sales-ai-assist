
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, Activity, Mail, User } from 'lucide-react';

const ProShortcutGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-3 animate-slide-up">
      <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
        <Link to="/record">
          <Mic className="h-5 w-5 text-nexentry-blue" />
          <span>Nouveau résumé</span>
        </Link>
      </Button>
      <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
        <Link to="/calls">
          <Activity className="h-5 w-5 text-nexentry-blue" />
          <span>Mes résumés</span>
        </Link>
      </Button>
      <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
        <Link to="/emails">
          <Mail className="h-5 w-5 text-nexentry-blue" />
          <span>Emails</span>
        </Link>
      </Button>
      <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
        <Link to="/clients">
          <User className="h-5 w-5 text-nexentry-blue" />
          <span>Contacts</span>
        </Link>
      </Button>
    </div>
  );
};

export default ProShortcutGrid;
