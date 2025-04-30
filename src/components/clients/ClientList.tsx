
import { motion } from 'framer-motion';
import ClientCard from '@/components/cards/ClientCard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  fullName: string;
  company?: string;
  email?: string;
  phone?: string;
  lastContacted?: Date;
  status: 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu';
}

interface ClientListProps {
  clients: Client[];
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
        <motion.div key={client.id} variants={item} layout>
          <ClientCard
            clientId={client.id}
            fullName={client.fullName}
            company={client.company}
            email={client.email}
            phone={client.phone}
            lastContacted={client.lastContacted}
            status={client.status}
            onClick={() => handleClientClick(client.id)}
            onSwipeLeft={() => onSwipeLeft && onSwipeLeft(client.id)}
            onSwipeRight={() => onSwipeRight && onSwipeRight(client.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ClientList;
