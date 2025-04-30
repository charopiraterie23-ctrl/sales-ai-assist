
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface LogoutSectionProps {
  signOut: () => void;
}

const LogoutSection = ({ signOut }: LogoutSectionProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <Button 
        variant="destructive" 
        className="w-full" 
        onClick={() => {
          signOut();
          toast.success('Vous êtes maintenant déconnecté');
        }}
      >
        <LogOut className="mr-2" /> Se déconnecter
      </Button>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Vous pouvez vous reconnecter à tout moment.
      </p>
    </div>
  );
};

export default LogoutSection;
