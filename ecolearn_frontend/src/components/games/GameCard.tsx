import { motion } from 'motion/react';
import { Play, Trophy, Coins, Clock, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';

export interface GameData {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ecoPoints: number;
  estimatedTime: string;
  category: string;
  icon: string;
  gradient: string;
  isLocked?: boolean;
  stars?: number;
  bestScore?: number;
}

interface GameCardProps {
  game: GameData;
  onPlay: (gameId: string) => void;
}

const difficultyColors = {
  easy: 'bg-[#3FB984] text-white',
  medium: 'bg-[#FFD166] text-gray-800',
  hard: 'bg-[#3069F0] text-white',
};

export function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glass Card */}
      <div className={cn(
        'relative overflow-hidden rounded-3xl glass-card p-6 h-full',
        'border-2 border-white/20 dark:border-white/10',
        'hover:shadow-2xl transition-all duration-300',
        game.isLocked && 'opacity-60 cursor-not-allowed'
      )}>
        {/* Gradient Background */}
        <div
          className={cn(
            'absolute inset-0 opacity-10 dark:opacity-20',
            game.gradient
          )}
        />

        {/* Icon/Emoji */}
        <div className="relative mb-4">
          <motion.div
            className={cn(
              'w-20 h-20 rounded-2xl flex items-center justify-center text-4xl',
              'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm',
              'shadow-lg group-hover:shadow-xl transition-shadow'
            )}
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {game.icon}
          </motion.div>

          {/* Lock Overlay */}
          {game.isLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative space-y-3">
          {/* Title & Difficulty */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-foreground group-hover:text-[#3FB984] transition-colors">
              {game.title}
            </h3>
            <Badge className={cn('shrink-0', difficultyColors[game.difficulty])}>
              {game.difficulty}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {game.description}
          </p>

          {/* Stats */}
          {/* <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-[#FFD166]">
              <Coins className="w-4 h-4" />
              <span>{game.ecoPoints}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{game.estimatedTime}</span>
            </div>
            {game.stars !== undefined && (
              <div className="flex items-center gap-1.5 text-[#FFD166]">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < game.stars ? 'fill-[#FFD166]' : 'fill-gray-300 dark:fill-gray-600'
                    )}
                  />
                ))}
              </div>
            )}
          </div> */}

          {/* Best Score */}
          {/* {game.bestScore !== undefined && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#3FB984]/10 dark:bg-[#3FB984]/20">
              <Trophy className="w-4 h-4 text-[#3FB984]" />
              <span className="text-sm text-[#3FB984]">
                Best: {game.bestScore} points
              </span>
            </div>
          )} */}

          {/* Play Button */}
          <Button
            onClick={() => !game.isLocked && onPlay(game.id)}
            disabled={game.isLocked}
            className={cn(
              'w-full mt-4 rounded-xl shadow-lg',
              'bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] hover:from-[#2d8a5f] hover:to-[#3FB984]',
              'transform transition-all duration-300',
              'group-hover:scale-105'
            )}
          >
            <Play className="w-4 h-4 mr-2" />
            {game.isLocked ? 'Locked' : 'Play Now'}
          </Button>
        </div>

        {/* Floating particles effect on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#3FB984]/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
