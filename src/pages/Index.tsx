
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Navigate to homepage instead of login
  return <Navigate to="/" replace />;
};

export default Index;
