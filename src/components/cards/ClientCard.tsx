
import { Building, Phone, Mail, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ClientAvatar from './ClientAvatar';
import ClientStatusBadge from './ClientStatusBadge';
import ClientContactInfo from './ClientContactInfo';
import ClientSwipeActions from './ClientSwipeActions';

interface ClientCardProps {
  clientId: string;
  fullName: string;
  company?: string;
  email?: string;
  phone?: string;
  lastContacted?: Date;
  status: 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu';
  onClick?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const ClientCard = ({
  clientId,
  fullName,
  company,
  email,
  phone,
  lastContacted,
  status,
  onClick,
  onSwipeLeft,
  onSwipeRight
}: ClientCardProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX.current) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    
    // Limit the swipe distance
    const maxSwipe = 100;
    const newOffset = Math.max(Math.min(diff, maxSwipe), -maxSwipe);
    
    setSwipeOffset(newOffset);
  };

  const handleTouchEnd = () => {
    const threshold = 60; // Minimum distance to trigger action
    
    if (swipeOffset > threshold) {
      // Swipe right action - Follow up (email/SMS)
      onSwipeRight && onSwipeRight();
    } else if (swipeOffset < -threshold) {
      // Swipe left action - Call
      onSwipeLeft && onSwipeLeft();
    }
    
    // Reset swipe state
    startX.current = null;
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  const statusColors = {
    'lead': 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    'intéressé': 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    'en attente': 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    'conclu': 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    'perdu': 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };

  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ClientSwipeActions swipeOffset={swipeOffset} />
      
      <motion.div 
        className={cn(
          "mb-4 cursor-pointer transition-all duration-200 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-5",
          statusColors[status],
          isHovered ? "shadow-md scale-[1.01]" : ""
        )}
        style={{ transform: isSwiping ? `translateX(${swipeOffset}px)` : undefined }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start mb-3">
          <div className="relative">
            <ClientAvatar fullName={fullName} />
            <span className={cn(
              "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800",
              status === 'lead' ? "bg-blue-500" :
              status === 'intéressé' ? "bg-green-500" :
              status === 'en attente' ? "bg-yellow-500" :
              status === 'conclu' ? "bg-purple-500" : "bg-red-500"
            )}></span>
          </div>
          
          <div className="flex-1 ml-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-base text-gray-900 dark:text-white">{fullName}</h3>
              <ClientStatusBadge status={status} />
            </div>
            {company && (
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                <Building size={12} className="mr-1" />
                {company}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 text-sm">
          {email && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Mail size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
              <span className="truncate">{email}</span>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Phone size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
              <span>{phone}</span>
            </div>
          )}
          
          {lastContacted && (
            <div className="flex items-center text-gray-600 dark:text-gray-300 sm:col-span-2">
              <Calendar size={14} className="mr-2 text-gray-400 dark:text-gray-500" />
              <span>Dernier contact: {lastContacted.toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <motion.button 
            className="text-blue-600 dark:text-blue-400 flex items-center text-sm font-medium"
            whileHover={{ x: 5 }}
          >
            Détails
            <ArrowRight size={14} className="ml-1" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientCard;
