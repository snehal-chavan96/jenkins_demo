import { useEffect, useState } from 'react';
import { Trophy, Medal, Leaf, TrendingUp, Crown, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { leaderboardAPI } from '../services/leaderboard';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { PageLoader } from '../components/common/Loader';

interface UILeaderboardEntry {
  rank: number;
  name: string;
  ecoPoints: number;
  level: string;
  avatar: string;
  school: string;
}


export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const avatarFor = (name: string) =>
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
      name
    )}`;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const backendData = await leaderboardAPI.getGlobal();

        /*  TRANSFORM BACKEND → UI FORMAT */
        const transformed: UILeaderboardEntry[] = backendData.map(
          (item: any, index: number) => ({
            rank: index + 1,
            name: item.studentName,
            ecoPoints: item.ecoPoints,
            level: item.level,
            avatar: avatarFor(item.studentName),
            school: "EcoLearn Academy", // placeholder
          })
        );

        setLeaderboard(transformed);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading) return <PageLoader />;
  const currentUserEntry = leaderboard.find(
  (entry) => entry.name === user?.name
);


  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" fill="currentColor" />;
    if (rank === 2) return <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" fill="currentColor" />;
    if (rank === 3) return <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" fill="currentColor" />;
    return <span className="text-sm sm:text-base text-gray-600">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300 px-4 py-6 sm:py-8 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-3 sm:mb-4"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFD166]" fill="currentColor" />
          </motion.div>
          <h1 className="mb-2 text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-[#FFD166] to-[#f5b93d] bg-clip-text text-transparent">
            Top Eco-Heroes! 🏆
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-foreground px-4">
            The best planet savers from around the world!
          </p>
        </motion.div>

        {/* Top 3 Podium - Responsive Layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          {/* Mobile/Tablet: Vertical Stack */}
          <div className="flex flex-col sm:hidden gap-4 mb-8">
            {topThree.map((entry, idx) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              >
                <Card className={`glass-card border-4 rounded-2xl shadow-xl ${entry.rank === 1 ? 'border-[#FFD166]' :
                  entry.rank === 2 ? 'border-gray-400' :
                    'border-orange-400'
                  }`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="text-4xl">{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}</div>
                    <Avatar className={`h-16 w-16 ring-4 ${entry.rank === 1 ? 'ring-yellow-400' :
                      entry.rank === 2 ? 'ring-gray-300' :
                        'ring-orange-400'
                      }`}>
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg truncate text-foreground">{entry.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{entry.school}</p>
                      <div className="flex items-center gap-2 text-[#3FB984] mt-1">
                        <Leaf className="h-4 w-4" />
                        <span className="text-sm">{entry.ecoPoints.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Desktop: Traditional Podium */}
          <div className="hidden sm:flex items-end justify-center gap-3 lg:gap-4 mb-8">
            {/* 2nd Place */}
            {topThree[1] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <Avatar className="h-16 w-16 lg:h-20 lg:w-20 mb-3 ring-4 ring-gray-300">
                  <AvatarImage src={topThree[1].avatar} alt={topThree[1].name} />
                  <AvatarFallback>{topThree[1].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mb-1 text-sm lg:text-base text-center">{topThree[1].name}</h3>
                <p className="text-xs lg:text-sm text-gray-600 mb-2 text-center">{topThree[1].school}</p>
                <div className="flex items-center gap-2 text-green-600 mb-3">
                  <Leaf className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-sm lg:text-base">{topThree[1].ecoPoints.toLocaleString()}</span>
                </div>
                <div className="h-28 lg:h-32 w-24 lg:w-32 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-2xl flex items-center justify-center shadow-xl">
                  <Medal className="h-10 w-10 lg:h-12 lg:w-12 text-white" fill="currentColor" />
                </div>
                <div className="bg-gray-400 text-white py-2 px-4 rounded-b-2xl text-sm lg:text-base">2nd 🥈</div>
              </motion.div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-2"
                >
                  <Crown className="h-8 w-8 lg:h-10 lg:w-10 text-yellow-500" fill="currentColor" />
                </motion.div>
                <Avatar className="h-20 w-20 lg:h-24 lg:w-24 mb-3 ring-4 ring-yellow-400">
                  <AvatarImage src={topThree[0].avatar} alt={topThree[0].name} />
                  <AvatarFallback>{topThree[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mb-1 text-base lg:text-lg text-center">{topThree[0].name}</h3>
                <p className="text-xs lg:text-sm text-gray-600 mb-2 text-center">{topThree[0].school}</p>
                <div className="flex items-center gap-2 text-green-600 mb-3">
                  <Leaf className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="text-base lg:text-lg">{topThree[0].ecoPoints.toLocaleString()}</span>
                </div>
                <div className="h-36 lg:h-40 w-24 lg:w-32 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-t-2xl flex items-center justify-center shadow-xl">
                  <Trophy className="h-10 w-10 lg:h-12 lg:w-12 text-white" fill="currentColor" />
                </div>
                <div className="bg-yellow-500 text-white py-2 px-4 rounded-b-2xl text-sm lg:text-base">1st 🥇</div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <Avatar className="h-16 w-16 lg:h-20 lg:w-20 mb-3 ring-4 ring-orange-400">
                  <AvatarImage src={topThree[2].avatar} alt={topThree[2].name} />
                  <AvatarFallback>{topThree[2].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mb-1 text-sm lg:text-base text-center">{topThree[2].name}</h3>
                <p className="text-xs lg:text-sm text-gray-600 mb-2 text-center">{topThree[2].school}</p>
                <div className="flex items-center gap-2 text-green-600 mb-3">
                  <Leaf className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-sm lg:text-base">{topThree[2].ecoPoints.toLocaleString()}</span>
                </div>
                <div className="h-24 lg:h-28 w-24 lg:w-32 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-2xl flex items-center justify-center shadow-xl">
                  <Medal className="h-10 w-10 lg:h-12 lg:w-12 text-white" fill="currentColor" />
                </div>
                <div className="bg-orange-500 text-white py-2 px-4 rounded-b-2xl text-sm lg:text-base">3rd 🥉</div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Rest of Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-3 sm:border-4 border-green-200 rounded-2xl sm:rounded-3xl shadow-xl">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 transition-colors
  ${
    entry.name === user?.name
      ? `
        bg-green-100 dark:bg-green-900/40
        border-l-4 border-green-500 dark:border-green-400
      `
      : `
        hover:bg-gray-50 dark:hover:bg-gray-800
      `
  }
`}


                  >
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex-shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>

                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-sm sm:text-base">{entry.name}</h4>
                        {entry.name === user?.name && (
                          <Badge className="bg-green-500 text-white text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{entry.school}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 sm:gap-2 text-green-600">
                        <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-sm sm:text-base">{entry.ecoPoints.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 justify-end">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs">+125</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Your Stats Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 sm:mt-8"
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-green-300 rounded-2xl sm:rounded-3xl shadow-xl">
              <CardContent className="p-4 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
                      <h3 className="text-lg sm:text-xl text-white">Your Performance</h3>
                    </div>
                    <p className="text-sm sm:text-base text-green-100">Keep learning to climb higher!</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="mb-1 text-xl sm:text-2xl text-white">{user.ecoPoints} Points</div>
                    {currentUserEntry && (
                      <div className="text-sm sm:text-base text-green-100">
                        Rank #{currentUserEntry.rank} 🎯
                      </div>
                    )}

                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};