
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-nexentry-blue"></div>
      </div>
    );
  }
  
  // Navigate to homepage instead of login
  return <Navigate to="/" replace />;
};

export default Index;
