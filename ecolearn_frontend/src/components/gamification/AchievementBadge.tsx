import { motion } from 'motion/react';
import { Trophy, Star, Zap, Award, Crown, Medal } from 'lucide-react';
import { cn } from '../ui/utils';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'zap' | 'award' | 'crown' | 'medal';
  color: 'primary' | 'secondary' | 'accent' | 'purple' | 'orange';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  total?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  award: Award,
  crown: Crown,
  medal: Medal,
};

const colorMap = {
  primary: {
    bg: 'from-[#3FB984] to-[#2d8a5f]',
    glow: 'shadow-[0_0_20px_rgba(63,185,132,0.5)]',
    ring: 'ring-[#3FB984]/30',
  },
  secondary: {
    bg: 'from-[#3069F0] to-[#2451c7]',
    glow: 'shadow-[0_0_20px_rgba(48,105,240,0.5)]',
    ring: 'ring-[#3069F0]/30',
  },
  accent: {
    bg: 'from-[#FFD166] to-[#f5b93d]',
    glow: 'shadow-[0_0_20px_rgba(255,209,102,0.5)]',
    ring: 'ring-[#FFD166]/30',
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    ring: 'ring-purple-500/30',
  },
  orange: {
    bg: 'from-orange-500 to-orange-600',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
    ring: 'ring-orange-500/30',
  },
};

const sizeMap = {
  sm: {
    container: 'w-16 h-20',
    icon: 'w-8 h-8',
    badge: 'w-12 h-12',
  },
  md: {
    container: 'w-20 h-24',
    icon: 'w-10 h-10',
    badge: 'w-16 h-16',
  },
  lg: {
    container: 'w-24 h-28',
    icon: 'w-12 h-12',
    badge: 'w-20 h-20',
  },
};

export function AchievementBadge({ 
  achievement, 
  size = 'md',
  showProgress = true 
}: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon];
  const colors = colorMap[achievement.color];
  const sizes = sizeMap[size];

  return (
    <motion.div
      className={cn(
        'relative flex flex-col items-center gap-2',
        sizes.container
      )}
      whileHover={achievement.isUnlocked ? { scale: 1.1, y: -5 } : {}}
      whileTap={achievement.isUnlocked ? { scale: 0.95 } : {}}
    >
      {/* Badge Icon */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-2xl transition-all duration-300',
          sizes.badge,
          achievement.isUnlocked
            ? `bg-gradient-to-br ${colors.bg} ${colors.glow} ring-4 ${colors.ring}`
            : 'bg-gray-200 dark:bg-gray-700 opacity-50 grayscale'
        )}
      >
        <Icon
          className={cn(
            sizes.icon,
            achievement.isUnlocked ? 'text-white' : 'text-gray-400 dark:text-gray-500'
          )}
        />
        
        {achievement.isUnlocked && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white"
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* Progress Bar */}
      {showProgress && achievement.progress !== undefined && achievement.total !== undefined && !achievement.isUnlocked && (
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${colors.bg}`}
            initial={{ width: 0 }}
            animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Unlock Date */}
      {achievement.isUnlocked && achievement.unlockedAt && size !== 'sm' && (
        <span className="text-xs text-muted-foreground absolute -bottom-5">
          {new Date(achievement.unlockedAt).toLocaleDateString()}
        </span>
      )}
    </motion.div>
  );
}
