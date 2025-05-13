import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Define icons
const ArrowLeft = getIcon('ArrowLeft');
const Frown = getIcon('Frown');

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-50 dark:bg-surface-900"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }}
        className="w-full max-w-md"
      >
        <div className="card-neu flex flex-col items-center p-8 sm:p-10 text-center">
          <div className="w-24 h-24 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center mb-6">
            <Frown className="w-12 h-12 text-surface-600 dark:text-surface-300" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">404</h1>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 btn btn-primary"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}