
import { Badge } from '@/components/ui/badge';

interface DashboardWelcomeHeaderProps {
  fullName: string;
  userPlan: string;
}

const DashboardWelcomeHeader = ({ fullName, userPlan }: DashboardWelcomeHeaderProps) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold mb-1">
          Bonjour {fullName || 'utilisateur'} 👋
        </h1>
        {userPlan === 'pro' && (
          <Badge variant="outline" className="bg-nexentry-blue bg-opacity-10 text-nexentry-blue">
            Plan Pro actif
          </Badge>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-300">
        {userPlan === 'pro' 
          ? "Prêt(e) pour une nouvelle journée productive ?" 
          : "Prêt à gagner du temps ? Enregistrez un appel et laissez l'IA faire le reste."}
      </p>
    </div>
  );
};

export default DashboardWelcomeHeader;
