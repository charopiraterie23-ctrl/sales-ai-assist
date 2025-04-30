
import { motion } from 'framer-motion';
import ClientCard from '@/components/cards/ClientCard';
import { useNavigate } from 'react-router-dom';
import { ClientType } from '@/types/client';

interface ClientListProps {
  clients: ClientType[];
  onSwipeLeft?: (clientId: string) => void;
  onSwipeRight?: (clientId: string) => void;
}

const ClientList = ({ clients, onSwipeLeft, onSwipeRight }: ClientListProps) => {
  const navigate = useNavigate();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-2"
    >
      {clients.map((client) => (
        <motion.div key={client.clientId} variants={item} layout>
          <ClientCard
            clientId={client.clientId}
            fullName={client.fullName}
            company={client.company}
            email={client.email}
            phone={client.phone}
            lastContacted={client.lastContacted}
            status={client.status}
            onClick={() => handleClientClick(client.clientId)}
            onSwipeLeft={() => onSwipeLeft && onSwipeLeft(client.clientId)}
            onSwipeRight={() => onSwipeRight && onSwipeRight(client.clientId)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ClientList;
