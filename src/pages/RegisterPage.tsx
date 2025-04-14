
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AtSign, KeyRound, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(email, password, fullName);
    } catch (error: any) {
      // Vérifier si l'erreur est due à un utilisateur existant
      if (error.message && (
        error.message.includes('User already registered') || 
        error.message.includes('already exists')
      )) {
        toast.info('Ce compte existe déjà. Redirection vers la page de connexion...');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to dashboard instead of calls if user is logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-nexentry-blue-dark dark:text-white mb-2">nexentry</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Votre assistant commercial intelligent
          </p>
        </div>

        <div className="bg-white dark:bg-nexentry-blue-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-4 animate-slide-up">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-gray-500 hover:text-nexentry-blue">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-xl font-semibold ml-4">Créer un compte</h2>
          </div>
          
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jean Dupont"
                    className="pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Minimum 6 caractères
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-nexentry-blue hover:bg-nexentry-blue-dark"
                disabled={isLoading}
              >
                {isLoading ? 'Création...' : 'Créer mon compte'}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="text-center animate-fade-in">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-nexentry-blue font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
