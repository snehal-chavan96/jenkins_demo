import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
  borderColor?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({
  children,
  className = '',
  gradient = 'from-white/40 to-white/20',
  borderColor = 'border-white/60',
  hover = true,
  onClick,
}: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} dark:from-gray-900/40 dark:to-gray-800/40 backdrop-blur-xl border-2 ${borderColor} dark:border-white/20 shadow-xl ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Shine Effect on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
