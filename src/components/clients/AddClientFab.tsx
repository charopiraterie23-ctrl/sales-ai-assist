
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AddClientFab = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      size="icon"
      aria-label="Nouveau client"
      className="fixed bottom-[108px] right-6 z-40 w-14 h-14 rounded-full shadow-lg bg-[#2166F0] text-white hover:bg-blue-600 transition-colors"
      onClick={() => navigate('/add-client')}
    >
      <Plus size={24} />
    </Button>
  );
};

export default AddClientFab;
