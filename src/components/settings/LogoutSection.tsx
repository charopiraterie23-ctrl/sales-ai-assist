
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface LogoutSectionProps {
  signOut: () => void;
}

const LogoutSection = ({ signOut }: LogoutSectionProps) => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800/40 rounded-xl p-6 text-white">
      <Button 
        variant="destructive" 
        className="w-full bg-red-900/60 hover:bg-red-800" 
        onClick={() => {
          signOut();
          toast.success('Vous êtes maintenant déconnecté');
        }}
      >
        <LogOut className="mr-2" /> Se déconnecter
      </Button>
      <p className="text-sm text-gray-400 mt-2 text-center">
        Vous pouvez vous reconnecter à tout moment.
      </p>
    </div>
  );
};

export default LogoutSection;
