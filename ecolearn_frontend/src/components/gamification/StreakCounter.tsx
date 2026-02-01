import { motion } from 'motion/react';
import { Flame, Calendar } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

export const StreakCounter = ({ currentStreak, longestStreak, className = '' }: StreakCounterProps) => {
  const streakDays = [
    { day: 'Mon', active: true },
    { day: 'Tue', active: true },
    { day: 'Wed', active: true },
    { day: 'Thu', active: true },
    { day: 'Fri', active: false },
    { day: 'Sat', active: false },
    { day: 'Sun', active: false },
  ];

  return (
    <div className={className}>
      {/* Glassmorphism Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100/60 via-red-100/60 to-yellow-100/60 dark:from-orange-900/30 dark:via-red-900/30 dark:to-yellow-900/30 backdrop-blur-xl border-2 border-white/60 dark:border-white/20 shadow-xl p-6">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-red-200/30 dark:from-orange-800/20 dark:to-red-800/20" />
        
        <div className="relative z-10">
          {/* Header with Flame */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="h-8 w-8 text-orange-500 dark:text-orange-400" fill="currentColor" />
              </motion.div>
              <div>
                <h4 className="text-gray-900 dark:text-white">Streak</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Keep it burning!</p>
              </div>
            </div>
          </div>

          {/* Current Streak Display */}
          <div className="text-center mb-6">
            <motion.div
              className="text-6xl text-orange-600 dark:text-orange-400 inline-flex items-baseline gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>{currentStreak}</span>
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🔥
              </motion.span>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-300 mt-1">day streak</p>
          </div>

          {/* Week Progress */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {streakDays.map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`w-full aspect-square rounded-xl flex items-center justify-center mb-1 transition-all ${
                    item.active
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700 text-white shadow-lg'
                      : 'bg-white/50 dark:bg-gray-800/50 text-gray-400 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {item.active ? (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                    >
                      ✓
                    </motion.span>
                  ) : (
                    <Calendar className="h-3 w-3" />
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.day}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-white/60 dark:border-white/20">
            <div className="text-center flex-1">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Longest</p>
              <p className="text-xl text-orange-600 dark:text-orange-400">{longestStreak}</p>
            </div>
            <div className="h-8 w-px bg-white/60 dark:bg-white/20" />
            <div className="text-center flex-1">
              <p className="text-gray-500 dark:text-gray-400 text-sm">This Week</p>
              <p className="text-xl text-orange-600 dark:text-orange-400">4/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
