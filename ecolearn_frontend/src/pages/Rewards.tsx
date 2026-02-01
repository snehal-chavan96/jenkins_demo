import { useEffect, useState } from 'react';
import { Award, Lock, Sparkles, Trophy, Star, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { userAPI } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { PageLoader } from '../components/common/Loader';

export const Rewards = () => {
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await userAPI.getBadges();
        setBadges(data);
      } catch (error) {
        console.error('Failed to fetch badges:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (isLoading) return <PageLoader />;

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:py-8 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-3 sm:mb-4"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" fill="currentColor" />
          </motion.div>
          <h1 className="mb-2 text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
            Your Awesome Badges! 🏆
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 px-4">
            You've earned {earnedBadges.length} out of {badges.length} badges!
          </p>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-4 border-green-300 rounded-2xl sm:rounded-3xl shadow-2xl">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-3">
                <motion.div 
                  className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="mb-2 flex justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Award className="h-10 w-10 sm:h-12 sm:w-12" />
                  </motion.div>
                  <div className="mb-1 text-2xl sm:text-3xl text-white">{earnedBadges.length}</div>
                  <div className="text-sm sm:text-base text-green-100">Badges Earned</div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="mb-2 flex justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-10 w-10 sm:h-12 sm:w-12" />
                  </motion.div>
                  <div className="mb-1 text-2xl sm:text-3xl text-white">{lockedBadges.length}</div>
                  <div className="text-sm sm:text-base text-green-100">To Unlock</div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="mb-2 flex justify-center">
                    <div className="text-4xl sm:text-5xl">🌟</div>
                  </div>
                  <div className="mb-1 text-2xl sm:text-3xl text-white">
                    {Math.round((earnedBadges.length / badges.length) * 100)}%
                  </div>
                  <div className="text-sm sm:text-base text-green-100">Complete</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Earned Badges */}
        <div className="mb-8 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 sm:mb-6 text-2xl sm:text-3xl flex items-center gap-2 sm:gap-3"
          >
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
            <span>Earned Badges</span>
          </motion.h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 hover:shadow-2xl transition-all border-3 sm:border-4 border-yellow-300 dark:border-yellow-600 rounded-2xl sm:rounded-3xl">
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
                  <CardContent className="p-4 sm:p-6 relative">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                          delay: 0.4 + index * 0.1,
                        }}
                        whileHover={{ rotate: 360 }}
                        className="text-5xl sm:text-6xl"
                      >
                        {badge.icon}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl dark:text-white">{badge.name}</h3>
                          <Badge className="bg-green-500 text-white text-xs sm:text-sm">✨ Earned</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{badge.description}</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          🎉 Earned on {new Date(badge.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Locked Badges */}
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4 sm:mb-6 text-2xl sm:text-3xl flex items-center gap-2 sm:gap-3"
          >
            <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" />
            <span>Locked Badges</span>
          </motion.h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {lockedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-all border-3 sm:border-4 border-gray-300 dark:border-gray-600 rounded-2xl sm:rounded-3xl">
                  <CardContent className="p-4 sm:p-6 relative">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="relative">
                        <div className="text-5xl sm:text-6xl opacity-30 grayscale">{badge.icon}</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl text-gray-500 dark:text-gray-400">{badge.name}</h3>
                          <Badge variant="secondary" className="text-xs sm:text-sm">🔒 Locked</Badge>
                        </div>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">{badge.description}</p>
                        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                          Complete the mission to unlock! 🎯
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 sm:mt-12"
        >
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-4 border-purple-300 rounded-2xl sm:rounded-3xl shadow-2xl">
            <CardContent className="p-6 sm:p-8 text-center">
              <motion.div
                className="text-5xl sm:text-6xl lg:text-7xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🚀
              </motion.div>
              <h2 className="mb-3 text-2xl sm:text-3xl text-white">You're Doing Amazing!</h2>
              <p className="text-base sm:text-lg lg:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                Keep completing courses and challenges to unlock all badges and become the ultimate eco-champion! 🌍
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};