
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ClientAvatarProps {
  fullName: string;
}

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

const ClientAvatar = ({ fullName }: ClientAvatarProps) => {
  const avatarColor = generateAvatarColor(fullName);
  
  return (
    <Avatar className={cn("h-10 w-10", avatarColor)}>
      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
    </Avatar>
  );
};

export default ClientAvatar;
