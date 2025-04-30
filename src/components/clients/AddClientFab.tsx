
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddClientFab = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/clients/add')}
      className="fixed right-6 bottom-[84px] w-14 h-14 rounded-full bg-gradient-to-br from-nexentry-purple to-nexentry-purple-vivid text-white flex items-center justify-center shadow-lg z-50"
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 20px 25px -5px rgba(155, 135, 245, 0.4), 0 10px 10px -5px rgba(155, 135, 245, 0.3)"
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Plus size={24} />
    </motion.button>
  );
};

export default AddClientFab;
