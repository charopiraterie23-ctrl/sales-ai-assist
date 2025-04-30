
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface DashboardWelcomeHeaderProps {
  fullName: string;
  userPlan: string;
  trialMinutesRemaining?: number;
  showTrialBanner?: boolean;
}

const DashboardWelcomeHeader = ({ 
  fullName, 
  userPlan, 
  trialMinutesRemaining, 
  showTrialBanner 
}: DashboardWelcomeHeaderProps) => {
  // Normaliser à nouveau userPlan pour éviter des problèmes de casse
  const isPro = userPlan?.toLowerCase() === 'pro';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-6"
    >
      <div className="flex justify-between items-start">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-bold mb-1 bg-gradient-to-r from-nexentry-purple-vivid to-nexentry-purple bg-clip-text text-transparent"
        >
          Bonjour {fullName || 'utilisateur'} 👋
        </motion.h1>
        {isPro && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          >
            <Badge variant="outline" className="h-6 px-2.5 py-0.5 flex items-center justify-center rounded-full bg-gradient-to-r from-nexentry-purple to-nexentry-purple-vivid text-white border-none shadow-sm">
              Pro
            </Badge>
          </motion.div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <motion.p 
          className="text-sm text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Prêt·e pour une journée productive ?
        </motion.p>
        {showTrialBanner && (
          <motion.span 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs bg-gradient-to-r from-nexentry-blue-light to-nexentry-blue text-white px-2.5 py-1 rounded-full shadow-sm"
          >
            {trialMinutesRemaining} min audio restantes
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardWelcomeHeader;
