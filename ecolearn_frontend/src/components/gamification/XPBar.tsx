import { motion } from 'motion/react';
import { Sparkles, Zap } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  className?: string;
}

export const XPBar = ({ currentXP, requiredXP, level, className = '' }: XPBarProps) => {
  const percentage = Math.min((currentXP / requiredXP) * 100, 100);
  const xpNeeded = requiredXP - currentXP;

  return (
    <div className={`relative ${className}`}>
      {/* Glassmorphism Container */}
      <div className="relative overflow-hidden rounded-2xl bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-2 border-white/60 dark:border-white/20 shadow-xl p-6">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 via-blue-100/50 to-purple-100/50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20" />
        
        {/* Floating Particles */}
        <motion.div
          className="absolute top-2 right-4 text-yellow-400"
          animate={{ y: [-5, 5, -5], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>
        <motion.div
          className="absolute bottom-2 left-6 text-green-400"
          animate={{ y: [5, -5, 5], rotate: [0, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Zap className="h-4 w-4" />
        </motion.div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚡
              </motion.div>
              <div>
                <h4 className="text-gray-900 dark:text-white">Experience Points</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Level {level}</p>
              </div>
            </div>
            <div className="text-right">
              <motion.div
                className="text-2xl text-green-600 dark:text-green-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentXP}
              </motion.div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">/ {requiredXP} XP</p>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="relative h-8 rounded-full bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/60 dark:border-white/20 overflow-hidden shadow-inner">
            {/* Animated Background Pattern */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(45deg, transparent 25%, currentColor 25%, currentColor 50%, transparent 50%, transparent 75%, currentColor 75%, currentColor)',
                backgroundSize: '20px 20px',
              }}
              animate={{ backgroundPosition: ['0px 0px', '20px 20px'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            {/* Progress Fill */}
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 dark:from-green-500 dark:via-emerald-600 dark:to-green-700 shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {/* Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-700 dark:text-white drop-shadow-md z-10">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>

          {/* XP Needed Text */}
          <motion.p
            className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎯 {xpNeeded > 0 ? `${xpNeeded} XP to level ${level + 1}!` : 'Level up! 🎉'}
          </motion.p>
        </div>
      </div>
    </div>
  );
};
