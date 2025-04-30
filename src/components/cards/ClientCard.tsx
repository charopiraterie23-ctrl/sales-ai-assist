
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User, Building, Mail, Phone as PhoneIcon, Clock, MoreHorizontal, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientCardProps {
  clientId: string;
  fullName: string;
  company?: string;
  email?: string;
  phone?: string;
  lastContacted?: Date;
  status: 'lead' | 'intéressé' | 'en attente' | 'conclu' | 'perdu';
  onClick?: () => void;
}

const statusColors = {
  lead: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300',
  intéressé: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300',
  'en attente': 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300',
  conclu: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300',
  perdu: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300',
};

// Function to generate a consistent color based on a name
const generateAvatarColor = (name: string) => {
  // Simple hash function
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Define a set of soft colors suitable for avatars
  const colors = [
    'bg-blue-200 text-blue-800',
    'bg-green-200 text-green-800',
    'bg-yellow-200 text-yellow-800',
    'bg-purple-200 text-purple-800',
    'bg-pink-200 text-pink-800',
    'bg-indigo-200 text-indigo-800',
    'bg-red-200 text-red-800',
    'bg-orange-200 text-orange-800',
    'bg-teal-200 text-teal-800',
  ];
  
  // Use the hash to select a color
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

// Function to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const ClientCard = ({
  clientId,
  fullName,
  company,
  email,
  phone,
  lastContacted,
  status,
  onClick,
}: ClientCardProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef<number | null>(null);
  const avatarColor = generateAvatarColor(fullName);

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
      console.log('Follow up with client', clientId);
    } else if (swipeOffset < -threshold) {
      // Swipe left action - Call
      console.log('Call client', clientId);
    }
    
    // Reset swipe state
    startX.current = null;
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Calling client', clientId);
    if (phone) {
      window.open(`tel:${phone}`);
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Messaging client', clientId);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit client', clientId);
    window.location.href = `/edit-client/${clientId}`;
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Archive client', clientId);
  };

  // Render action buttons that appear during swipe
  const renderSwipeActions = () => {
    const leftAction = swipeOffset < 0 && (
      <div 
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-green-500 text-white"
        style={{ opacity: Math.min(Math.abs(swipeOffset) / 60, 1) }}
      >
        <PhoneIcon size={20} />
      </div>
    );

    const rightAction = swipeOffset > 0 && (
      <div 
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-500 text-white"
        style={{ opacity: Math.min(Math.abs(swipeOffset) / 60, 1) }}
      >
        <MessageSquare size={20} />
      </div>
    );

    return (
      <>
        {leftAction}
        {rightAction}
      </>
    );
  };

  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {renderSwipeActions()}
      
      <div 
        className={cn(
          "nexentry-card mb-4 cursor-pointer transition-transform",
          isSwiping ? "" : "duration-300"
        )}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onClick={onClick}
      >
        <div className="flex items-start mb-3">
          <Avatar className={cn("mr-3 h-10 w-10", avatarColor)}>
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base">{fullName}</h3>
              <Badge variant="outline" className={cn('rounded-full px-2 py-0.5 text-xs border', statusColors[status])}>
                {status}
              </Badge>
            </div>
            {company && (
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Building size={12} className="mr-1" />
                {company}
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal size={18} className="text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => onClick && onClick()}>
                Voir la fiche
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>Modifier</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCall} disabled={!phone}>
                Appeler
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMessage}>Envoyer un message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleArchive} className="text-red-600">
                Archiver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {email && (
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <Mail size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <PhoneIcon size={14} className="mr-1 flex-shrink-0" />
              <span>{phone}</span>
            </div>
          )}
        </div>
        
        {lastContacted && (
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-2">
            <Clock size={12} className="mr-1" />
            Dernier contact: {formatDistanceToNow(lastContacted, { addSuffix: true, locale: fr })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCard;
