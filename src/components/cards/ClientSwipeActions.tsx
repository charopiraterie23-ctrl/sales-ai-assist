
import { Mail, Phone as PhoneIcon } from 'lucide-react';

interface ClientSwipeActionsProps {
  swipeOffset: number;
}

const ClientSwipeActions = ({ swipeOffset }: ClientSwipeActionsProps) => {
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
      <Mail size={20} />
    </div>
  );

  return (
    <>
      {leftAction}
      {rightAction}
    </>
  );
};

export default ClientSwipeActions;
