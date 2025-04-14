
import { useAuth } from '@/context/AuthContext';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UserMenuButton = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <Button asChild size="sm">
        <Link to="/">Se connecter</Link>
      </Button>
    );
  }

  return <UserMenu />;
};

export default UserMenuButton;
