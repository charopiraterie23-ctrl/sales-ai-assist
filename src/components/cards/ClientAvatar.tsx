
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ClientAvatarProps {
  fullName: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Function to generate a consistent color based on a name
const generateAvatarColor = (name: string) => {
  // Simple hash function
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Define a set of vibrant gradient backgrounds
  const gradients = [
    'bg-gradient-to-br from-blue-400 to-indigo-600 dark:from-blue-500 dark:to-indigo-700',
    'bg-gradient-to-br from-green-400 to-teal-600 dark:from-green-500 dark:to-teal-700',
    'bg-gradient-to-br from-purple-400 to-indigo-600 dark:from-purple-500 dark:to-indigo-700',
    'bg-gradient-to-br from-yellow-400 to-orange-600 dark:from-yellow-500 dark:to-orange-700',
    'bg-gradient-to-br from-pink-400 to-rose-600 dark:from-pink-500 dark:to-rose-700',
    'bg-gradient-to-br from-indigo-400 to-purple-600 dark:from-indigo-500 dark:to-purple-700',
    'bg-gradient-to-br from-red-400 to-pink-600 dark:from-red-500 dark:to-pink-700',
    'bg-gradient-to-br from-orange-400 to-red-600 dark:from-orange-500 dark:to-red-700',
    'bg-gradient-to-br from-teal-400 to-green-600 dark:from-teal-500 dark:to-green-700',
  ];
  
  // Use the hash to select a gradient
  const gradientIndex = Math.abs(hash) % gradients.length;
  return gradients[gradientIndex];
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

const ClientAvatar = ({ fullName, imageUrl, size = 'md' }: ClientAvatarProps) => {
  const avatarColor = generateAvatarColor(fullName);
  const sizeClass = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-lg"
  };
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      className="rounded-full shadow-md"
    >
      <Avatar className={cn(sizeClass[size], "ring-2 ring-white/80 dark:ring-gray-800/80")}>
        {imageUrl && <AvatarImage src={imageUrl} alt={fullName} />}
        <AvatarFallback className={cn(avatarColor, "font-medium text-white")}>
          {getInitials(fullName)}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
};

export default ClientAvatar;
