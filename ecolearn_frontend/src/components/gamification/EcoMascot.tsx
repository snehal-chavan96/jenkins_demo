import { motion } from 'motion/react';
import { useState } from 'react';

interface EcoMascotProps {
  message?: string;
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const mascotMessages = {
  happy: ["Great job! 🌟", "You're doing amazing!", "Keep it up!"],
  excited: ["WOW! Incredible! 🎉", "You're on fire! 🔥", "Amazing work!"],
  thinking: ["Hmm... 🤔", "Let's see...", "Think green!"],
  celebrating: ["WOOHOO! 🎊", "You're a star! ⭐", "Legendary!"],
};

export const EcoMascot = ({
  message,
  mood = 'happy',
  size = 'medium',
  className = '',
}: EcoMascotProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const randomMessage = message || mascotMessages[mood][Math.floor(Math.random() * mascotMessages[mood].length)];

  const sizeClasses = {
    small: 'h-16 w-16',
    medium: 'h-24 w-24',
    large: 'h-32 w-32',
  };

  const getMascotExpression = () => {
    switch (mood) {
      case 'excited':
        return '😄';
      case 'celebrating':
        return '🥳';
      case 'thinking':
        return '🤔';
      default:
        return '😊';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Mascot */}
      <motion.div
        className={`relative ${sizeClasses[size]} cursor-pointer`}
        onClick={() => setShowMessage(!showMessage)}
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* Mascot Body - Earth Character */}
        <div className="relative">
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-blue-400 blur-xl opacity-60"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Main Body */}
          <motion.div
            className="relative rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-blue-500 shadow-2xl flex items-center justify-center text-4xl border-4 border-white"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="relative z-10">🌍</span>
            
            {/* Face Expression */}
            <motion.div
              className="absolute text-2xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {getMascotExpression()}
            </motion.div>
          </motion.div>

          {/* Floating Leaves */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl"
              style={{
                left: `${30 + i * 20}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [-5, 5, -5],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              🌿
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Speech Bubble */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-20"
        >
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-xl border-2 border-green-400 dark:border-green-600 whitespace-nowrap">
            <p className="text-gray-800 dark:text-white">{randomMessage}</p>
            {/* Bubble Tail */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-green-400 dark:border-t-green-600" />
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-white dark:border-t-gray-800" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Tap Indicator */}
      {!showMessage && (
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Click me!
        </motion.div>
      )}
    </div>
  );
};
