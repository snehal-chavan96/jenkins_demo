import { Leaf, Sprout } from 'lucide-react';
import { motion } from 'motion/react';

export const Loader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <div className="text-center">
        <motion.div
          className="relative mx-auto mb-6"
          style={{ width: 100, height: 100 }}
        >
          {/* Growing plant animation */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 60, opacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          >
            <div className="w-2 bg-gradient-to-t from-green-700 to-green-500 rounded-full" style={{ height: '100%' }} />
          </motion.div>
          
          {/* Leaves */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: 40 }}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: -45 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: 0.3,
            }}
          >
            <Leaf className="h-8 w-8 text-green-500" />
          </motion.div>
          
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: 50 }}
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            <Leaf className="h-8 w-8 text-green-400" />
          </motion.div>
          
          {/* Top sprout */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: 60 }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: 0.7,
            }}
          >
            <Sprout className="h-10 w-10 text-green-600" />
          </motion.div>
          
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-800 to-amber-700 rounded-full" />
        </motion.div>
        
        <motion.p
          className="text-lg text-green-700"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Growing your eco-experience...
        </motion.p>
      </div>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <div className="text-center">
        <motion.div
          className="mx-auto mb-4"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 shadow-lg">
            <Leaf className="h-8 w-8 text-white" />
          </div>
        </motion.div>
        <motion.p
          className="text-green-700"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
};
