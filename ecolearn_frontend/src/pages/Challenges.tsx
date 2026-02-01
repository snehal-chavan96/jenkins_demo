import { useEffect, useState } from 'react';
import { Target, Users, Clock, Leaf, Search, Filter, Zap, Star, Trophy, Sparkles, Gamepad2 } from 'lucide-react';
import { motion } from 'motion/react';
import { challengeAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { PageLoader } from '../components/common/Loader';
import { toast } from 'sonner';
import { EcoPlacementGame } from '../components/games/EcoPlacementGame';

export const Challenges = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await challengeAPI.getAll();
        setChallenges(data);
      } catch (error) {
        console.error('Failed to fetch challenges:', error);
        toast.error('Failed to load challenges');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || challenge.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleParticipate = async (challengeId: string) => {
    try {
      const response = await challengeAPI.participate(challengeId);
      toast.success(`Awesome! 🎉 You earned ${response.ecoPoints} eco-points!`);
    } catch (error) {
      toast.error('Oops! Try again later.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'from-green-400 to-green-600';
      case 'Medium':
        return 'from-yellow-400 to-orange-500';
      case 'Hard':
        return 'from-red-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 1;
      case 'Medium':
        return 2;
      case 'Hard':
        return 3;
      default:
        return 1;
    }
  };

  if (isLoading) return <PageLoader />;

  // If game is active, show only the game
  if (showGame) {
    return (
      <div className="relative">
        <div className="absolute top-4 left-4 z-50">
          <Button
            onClick={() => setShowGame(false)}
            variant="outline"
            className="rounded-xl border-2 border-green-400 bg-white/90 backdrop-blur-lg hover:bg-green-50"
          >
            ← Back to Challenges
          </Button>
        </div>
        <EcoPlacementGame />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 px-4 py-6 sm:py-8 lg:px-8">
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
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" fill="currentColor" />
            <span className="text-sm sm:text-base text-orange-600">Challenge Yourself!</span>
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" fill="currentColor" />
          </motion.div>
          <h1 className="mb-2 text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Epic Eco Challenges! 🎯
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto px-4">
            Complete fun missions and save the planet!
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="border-3 sm:border-4 border-orange-200 rounded-2xl sm:rounded-3xl shadow-xl bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 sm:left-4 top-3 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    placeholder="Search challenges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 sm:pl-12 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-orange-200 focus:border-orange-400 text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {[
                    { value: 'all', label: 'All', icon: '🌍' },
                    { value: 'real-world', label: 'Real-World', icon: '🌳' },
                    { value: 'quiz', label: 'Quiz', icon: '📝' }
                  ].map((type) => (
                    <motion.div key={type.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={selectedType === type.value ? 'default' : 'outline'}
                        onClick={() => setSelectedType(type.value)}
                        className={`rounded-xl sm:rounded-2xl text-sm sm:text-base h-10 sm:h-12 px-3 sm:px-4 ${
                          selectedType === type.value
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                            : 'border-2 border-orange-300 hover:bg-orange-50'
                        }`}
                      >
                        <span className="mr-1 sm:mr-2">{type.icon}</span>
                        {type.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Challenges Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {/* Eco Placement Game Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <Card className="h-full hover:shadow-2xl transition-all border-3 sm:border-4 border-purple-300 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between gap-3 mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div 
                      className="text-3xl sm:text-4xl lg:text-5xl"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎮
                    </motion.div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Eco Placement Challenge</CardTitle>
                      <CardDescription className="mt-1 text-sm sm:text-base">
                        🎯 Interactive Game
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none">
                    NEW!
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Drag and drop eco-friendly objects onto a 5×5 grid! Race against time to maximize your environmental impact score.
                </p>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="text-sm sm:text-base">2 minutes</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-400 to-purple-600 text-white border-none text-xs sm:text-sm px-2 sm:px-3 py-1">
                      {[...Array(2)].map((_, i) => (
                        <Star key={i} className="inline h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" />
                      ))}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      <span className="text-sm sm:text-base">30 Eco Objects</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700 bg-green-100 px-2 sm:px-3 py-1 rounded-lg">
                      <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Up to 250 pts</span>
                    </div>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="w-full h-12 sm:h-14 text-base sm:text-lg rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 hover:from-purple-600 hover:via-purple-700 hover:to-pink-700 shadow-xl"
                    onClick={() => setShowGame(true)}
                  >
                    <Gamepad2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Play Now!
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className="h-full hover:shadow-2xl transition-all border-3 sm:border-4 border-orange-200 rounded-2xl sm:rounded-3xl bg-white">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between gap-3 mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <motion.div 
                        className="text-3xl sm:text-4xl lg:text-5xl"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {challenge.icon}
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl">{challenge.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm sm:text-base">
                          {challenge.type === 'real-world' ? '🌳 Real-World' : '📝 Quiz'}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{challenge.description}</p>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        <span className="text-sm sm:text-base">{challenge.duration}</span>
                      </div>
                      <Badge className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white border-none text-xs sm:text-sm px-2 sm:px-3 py-1`}>
                        {[...Array(getDifficultyStars(challenge.difficulty))].map((_, i) => (
                          <Star key={i} className="inline h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" />
                        ))}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        <span className="text-sm sm:text-base">{challenge.participants} kids</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700 bg-green-100 px-2 sm:px-3 py-1 rounded-lg">
                        <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">{challenge.ecoPoints} pts</span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="w-full h-12 sm:h-14 text-base sm:text-lg rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:via-orange-700 hover:to-red-700 shadow-xl"
                      onClick={() => handleParticipate(challenge.id)}
                    >
                      <Target className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Accept Challenge!
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <motion.div 
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-4">🔍</div>
            <h3 className="mb-2 text-xl sm:text-2xl">No challenges found</h3>
            <p className="text-base sm:text-lg text-gray-600">Try a different search or filter!</p>
          </motion.div>
        )}

        {/* Challenge Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-3 sm:border-4 border-orange-200 rounded-2xl sm:rounded-3xl shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                <h3 className="text-lg sm:text-xl text-orange-900">Pro Tips!</h3>
              </div>
              <ul className="space-y-2 text-sm sm:text-base text-orange-800 leading-relaxed">
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 text-orange-600" />
                  <span>Take photos to show your progress!</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 text-orange-600" />
                  <span>Team up with friends for real-world challenges!</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0 text-orange-600" />
                  <span>Harder challenges = More points! 🚀</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};