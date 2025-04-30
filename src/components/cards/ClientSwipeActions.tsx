
import { Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClientSwipeActionsProps {
  swipeOffset: number;
}

const ClientSwipeActions = ({ swipeOffset }: ClientSwipeActionsProps) => {
  // Calculate opacity based on swipe distance
  const rightActionOpacity = Math.min(Math.max(swipeOffset / 100, 0), 1);
  const leftActionOpacity = Math.min(Math.max(-swipeOffset / 100, 0), 1);
  
  return (
    <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-6">
      {/* Left side action (appears when swiping right) */}
      <motion.div 
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-nexentry-purple to-nexentry-purple-vivid text-white"
        style={{ opacity: rightActionOpacity, scale: 0.8 + rightActionOpacity * 0.2 }}
      >
        <Mail size={22} />
      </motion.div>
      
      {/* Right side action (appears when swiping left) */}
      <motion.div 
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white"
        style={{ opacity: leftActionOpacity, scale: 0.8 + leftActionOpacity * 0.2 }}
      >
        <Phone size={22} />
      </motion.div>
    </div>
  );
};

export default ClientSwipeActions;
