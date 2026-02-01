import { motion } from 'motion/react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
}

interface MiniLeaderboardProps {
  entries?: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

const defaultEntries: LeaderboardEntry[] = [
  { id: '1', name: 'Emma Green', points: 2850, rank: 1 },
  { id: '2', name: 'Alex Rivers', points: 2640, rank: 2 },
  { id: '3', name: 'Maya Forest', points: 2530, rank: 3 },
  { id: 'current', name: 'You', points: 2200, rank: 5 },
];

export const MiniLeaderboard = ({
  entries = defaultEntries,
  currentUserId = 'current',
  className = '',
}: MiniLeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" fill="currentColor" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 border-yellow-300 dark:border-yellow-700';
      case 2:
        return 'from-gray-100 to-slate-100 dark:from-gray-800/40 dark:to-slate-800/40 border-gray-300 dark:border-gray-600';
      case 3:
        return 'from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 border-orange-300 dark:border-orange-700';
      default:
        return 'from-white to-gray-50 dark:from-gray-900/40 dark:to-gray-800/40 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className={className}>
      {/* Glassmorphism Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100/60 via-pink-100/60 to-blue-100/60 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 backdrop-blur-xl border-2 border-white/60 dark:border-white/20 shadow-xl p-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-800/20" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="h-7 w-7 text-purple-600 dark:text-purple-400" fill="currentColor" />
            </motion.div>
            <div>
              <h4 className="text-gray-900 dark:text-white">Leaderboard</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Top eco-warriors</p>
            </div>
          </div>

          {/* Leaderboard Entries */}
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const isCurrentUser = entry.id === currentUserId;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 bg-gradient-to-r shadow-md transition-all ${
                    isCurrentUser
                      ? 'from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 border-green-400 dark:border-green-600 ring-2 ring-green-400/50'
                      : getRankColor(entry.rank)
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8">
                    {entry.rank <= 3 ? (
                      <motion.div
                        animate={
                          entry.rank === 1
                            ? { rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {getRankIcon(entry.rank)}
                      </motion.div>
                    ) : (
                      getRankIcon(entry.rank)
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-700 shadow-md">
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-600 text-white">
                      {entry.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`truncate ${isCurrentUser ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-white'}`}>
                      {entry.name}
                      {isCurrentUser && ' 🎯'}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white dark:border-gray-700">
                    <motion.span
                      className="text-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      🌿
                    </motion.span>
                    <span className={isCurrentUser ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}>
                      {entry.points}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* View Full Leaderboard Link */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            View Full Leaderboard →
          </motion.button>
        </div>
      </div>
    </div>
  );
};
