
import { Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
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

  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ClientSwipeActions swipeOffset={swipeOffset} />
      
      <div 
        className={cn(
          "nexentry-card mb-4 cursor-pointer transition-transform",
          isSwiping ? "" : "duration-300"
        )}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onClick={onClick}
      >
        <div className="flex items-start mb-2">
          <ClientAvatar fullName={fullName} />
          
          <div className="flex-1 ml-3">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-medium text-base">{fullName}</h3>
              <ClientStatusBadge status={status} />
            </div>
            {company && (
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Building size={12} className="mr-1" />
                {company}
              </div>
            )}
          </div>
        </div>
        
        <ClientContactInfo 
          email={email}
          phone={phone}
          lastContacted={lastContacted}
        />
      </div>
    </div>
  );
};

export default ClientCard;
