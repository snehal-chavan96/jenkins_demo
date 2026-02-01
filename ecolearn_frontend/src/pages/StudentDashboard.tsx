import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, BookOpen, Target, TrendingUp, Leaf, ArrowRight, Sparkles, Star, Zap, Trophy, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { courseAPI, challengeAPI, mockBadges } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { PageLoader } from '../components/common/Loader';
import { XPBar } from '../components/gamification/XPBar';
import { ProgressRing } from '../components/gamification/ProgressRing';
import { MiniLeaderboard } from '../components/gamification/MiniLeaderboard';
import { LevelUpAnimation } from '../components/gamification/LevelUpAnimation';
import { GlassCard } from '../components/gamification/GlassCard';
import { EcoMascot } from '../components/gamification/EcoMascot';
import { ChatbotWidget } from '../components/common/ChatbotWidget';
import bgImage from '../components/assets/bg-5.jpg';


export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, challengesData] = await Promise.all([
          courseAPI.getAll(),
          challengeAPI.getAll(),
        ]);
        setCourses(coursesData.slice(0, 3));
        setChallenges(challengesData.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <PageLoader />;

  const stats = [
    { label: 'Eco-Points', value: user?.ecoPoints || 0, icon: Leaf, color: 'from-green-400 to-green-600', emoji: '🌿', bgColor: 'from-green-100/60 to-green-200/60' },
    { label: 'Quizzes', value: 2, icon: ClipboardList, color: 'from-blue-400 to-blue-600', emoji: '📝', bgColor: 'from-blue-100/60 to-blue-200/60' },
    { label: 'Courses', value: 8, icon: BookOpen, color: 'from-purple-400 to-purple-600', emoji: '📚', bgColor: 'from-purple-100/60 to-purple-200/60' },
    { label: 'Challenges', value: 15, icon: Target, color: 'from-orange-400 to-orange-600', emoji: '🎯', bgColor: 'from-orange-100/60 to-orange-200/60' },
  ];

  const recentBadges = mockBadges.filter((b) => b.earned).slice(0, 4);

  return (
    <>
 <div
  className="min-h-screen bg-contain bg-center px-4 py-6 sm:py-8 lg:px-8"
  style={{ backgroundImage: `url(${bgImage})` }}
>
  <div className="
  absolute inset-0
  bg-gradient-to-br
  from-[#f0fdf4]/85
  via-[#dbeafe]/85
  to-[#fef3c7]/85

  dark:from-[#0f172a]/90
  dark:via-[#1e293b]/90
  dark:to-[#334155]/90
" />
{/* <div className=" min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] relative px-4 py-8 ">      <LevelUpAnimation show={showLevelUp} level={user?.level || 1} onClose={() => setShowLevelUp(false)} /> */}

      <div className="container mx-auto max-w-7xl">
        {/* Welcome Section with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard
            gradient="from-green-400/90 via-green-500/90 to-emerald-600/90"
            borderColor="border-white/80"
            className="mb-8 p-8 relative"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 text-9xl opacity-10">🌍</div>
            <div className="absolute bottom-0 left-0 text-7xl opacity-10">🌱</div>

            {/* Floating Mascot */}
            <div className="absolute top-4 right-8 hidden lg:block">
              <EcoMascot mood="happy" size="medium" />
            </div>

            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/30 rounded-full backdrop-blur-sm border border-white/60"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-white">Welcome back, Eco-Hero!</span>
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </motion.div>
              <h1 className="mb-2 text-white text-4xl sm:text-5xl">
                Hey {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-green-50 text-xl">
                Ready to save the planet today? Let's go on another amazing eco-adventure! 🚀
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Grid with Glassmorphism */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard
                gradient={`${stat.bgColor} dark:from-gray-800/60 dark:to-gray-900/60`}
                borderColor="border-white/80"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <span className="text-2xl">{stat.emoji}</span>
                        <span>{stat.label}</span>
                      </p>
                      <motion.p
                        className="text-gray-900 dark:text-white text-3xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="h-8 w-8 text-white" />
                    </motion.div>
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* XP Bar with Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <XPBar currentXP={2250} requiredXP={3000} level={user?.level || 1} />
            </motion.div>

            {/* Continue Learning */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard gradient="from-white/60 to-white/40" borderColor="border-green-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">📚</div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900 dark:text-white">Keep Learning!</CardTitle>
                      <CardDescription className="text-lg text-gray-600 dark:text-gray-400">Continue your eco-lessons</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((course, idx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="flex items-center gap-4 rounded-2xl border-2 border-green-200/60 dark:border-green-800/60 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm p-4 hover:bg-gradient-to-r hover:from-green-50/60 hover:to-blue-50/60 dark:hover:from-green-900/30 dark:hover:to-blue-900/30 transition-all cursor-pointer shadow-md"
                      onClick={() => navigate('/courses')}
                    >
                      <motion.div
                        className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                      >
                        <BookOpen className="h-10 w-10 text-white" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 truncate text-lg text-gray-900 dark:text-white">{course.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white border-none">
                            {course.level}
                          </Badge>
                          <span className="text-gray-600 dark:text-gray-400">• {course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={course.progress} className="flex-1 h-3" />
                          <span className="text-green-600 dark:text-green-400 whitespace-nowrap">{course.progress}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl border-2 border-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 text-lg py-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm"
                      onClick={() => navigate('/courses')}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Explore All Courses
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </CardContent>
              </GlassCard>
            </motion.div>

            {/* Active Challenges */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard gradient="from-white/60 to-white/40" borderColor="border-orange-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">🎯</div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900 dark:text-white">Epic Challenges!</CardTitle>
                      <CardDescription className="text-lg text-gray-600 dark:text-gray-400">Complete missions and earn rewards</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {challenges.map((challenge, idx) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="flex items-center justify-between rounded-2xl border-2 border-orange-200/60 dark:border-orange-800/60 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm p-4 hover:bg-gradient-to-r hover:from-orange-50/60 hover:to-yellow-50/60 dark:hover:from-orange-900/30 dark:hover:to-yellow-900/30 transition-all cursor-pointer shadow-md"
                      onClick={() => navigate('/epic-challenges/create')}

                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="text-5xl"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                        >
                          {challenge.icon}
                        </motion.div>
                        <div>
                          <h3 className="mb-1 text-lg text-gray-900 dark:text-white">{challenge.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-gradient-to-r from-orange-400 to-orange-600 text-white border-none">
                              {challenge.difficulty}
                            </Badge>
                            <span className="text-gray-600 dark:text-gray-400">• {challenge.duration}</span>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xl px-4 py-2 bg-green-100/80 dark:bg-green-900/40 rounded-xl backdrop-blur-sm"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Leaf className="h-5 w-5" />
                        <span>{challenge.ecoPoints}</span>
                      </motion.div>
                    </motion.div>
                  ))}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl border-2 border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 text-lg py-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm"
                      onClick={() => navigate('/epic-challenges/create')}
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      See All Challenges
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </CardContent>
              </GlassCard>
            </motion.div>
          </div>

          {/* Sidebar */}
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Environmental Quotes Cards */}
            {[
              "🌱 “Earth provides enough to satisfy every man's needs, but not every man's greed.” – Mahatma Gandhi",
              "🌍 “Take only memories, leave only footprints.” – Chief Seattle",
              "☀️ “Nature does not hurry, yet everything is accomplished.” – Rabindranath Tagore",
              "💧 “Every drop counts. Protect water, protect life.”",
              "🌿 “Small acts, when multiplied, can transform the world.”"
            ].map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <GlassCard gradient="from-green-400/50 via-green-300/50 to-green-200/50" borderColor="border-white/40">
                  <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 text-6xl opacity-10">🌿</div>
                    <p className="text-gray-900 dark:text-white text-lg sm:text-xl font-semibold relative z-10">
                      {quote}
                    </p>
                  </CardContent>
                </GlassCard>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
      <ChatbotWidget />
    </div>
    {/* </div> */}
    {/* </div> */}
    </>
  );
};