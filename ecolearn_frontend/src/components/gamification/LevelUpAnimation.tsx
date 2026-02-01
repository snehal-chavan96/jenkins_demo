import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Trophy } from 'lucide-react';

interface LevelUpAnimationProps {
  show: boolean;
  level: number;
  onClose?: () => void;
}

export const LevelUpAnimation = ({ show, level, onClose }: LevelUpAnimationProps) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose}
          >
            {/* Level Up Card */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glassmorphism Container */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-400/90 via-pink-400/90 to-yellow-400/90 backdrop-blur-xl border-4 border-white/80 shadow-2xl p-12 max-w-md">
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-pink-500/40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />

                {/* Floating Sparkles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-300"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, 20, -20],
                      x: [-10, 10, -10],
                      rotate: [0, 360],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                ))}

                <div className="relative z-10 text-center">
                  {/* Trophy Icon */}
                  <motion.div
                    className="mb-6 flex justify-center"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="relative">
                      <Trophy className="h-24 w-24 text-yellow-300" fill="currentColor" />
                      <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star className="h-8 w-8 text-yellow-400" fill="currentColor" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Level Up Text */}
                  <motion.h2
                    className="text-white mb-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🎉 LEVEL UP! 🎉
                  </motion.h2>

                  {/* Level Number */}
                  <motion.div
                    className="text-8xl text-white my-4"
                    animate={{
                      scale: [1, 1.1, 1],
                      textShadow: [
                        '0 0 20px rgba(255,255,255,0.5)',
                        '0 0 40px rgba(255,255,255,0.8)',
                        '0 0 20px rgba(255,255,255,0.5)',
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {level}
                  </motion.div>

                  <p className="text-white/90 text-xl mb-8">
                    You're now an <span className="text-yellow-300">Eco-Legend</span>!
                  </p>

                  {/* Rewards */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { icon: '🌟', label: '+100 XP' },
                      { icon: '💎', label: 'New Badge' },
                      { icon: '🎁', label: 'Reward' },
                    ].map((reward, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border-2 border-white/40"
                      >
                        <div className="text-3xl mb-1">{reward.icon}</div>
                        <p className="text-white text-sm">{reward.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Continue Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="w-full py-4 bg-white text-purple-600 rounded-2xl hover:bg-yellow-300 transition-colors shadow-xl"
                  >
                    Continue Adventure! 🚀
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
