import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Search, Filter, ArrowLeft } from 'lucide-react';
import { GameCard, GameData } from '../components/games/GameCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const GAMES: GameData[] = [
  {
    id: 'bubble-shooter',
    title: 'Eco Bubble Shooter',
    description: 'Pop pollution bubbles to clean the environment! Match colors to save the planet.',
    difficulty: 'easy',
    ecoPoints: 50,
    estimatedTime: '5-10 min',
    category: 'action',
    icon: '🫧',
    gradient: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    stars: 2,
    bestScore: 1250,
  },
  {
    id: 'water-conservation',
    title: 'Water Conservation Challenge',
    description: 'Fix leaking pipes and conserve water! Every drop counts in this puzzle game.',
    difficulty: 'medium',
    ecoPoints: 75,
    estimatedTime: '10-15 min',
    category: 'puzzle',
    icon: '💧',
    gradient: 'bg-gradient-to-br from-[#3069F0] to-blue-600',
    stars: 3,
    bestScore: 890,
  },
  {
    id: 'eco-tictactoe',
    title: 'Eco Tic-Tac-Toe',
    description: 'Classic game with an eco-twist! Plant trees vs reduce waste in strategic battles.',
    difficulty: 'easy',
    ecoPoints: 30,
    estimatedTime: '5 min',
    category: 'strategy',
    icon: '🌳',
    gradient: 'bg-gradient-to-br from-[#3FB984] to-green-600',
    stars: 1,
    bestScore: 450,
  },
  // {
  //   id: 'recycling-challenge',
  //   title: 'Recycling Rush',
  //   description: 'Sort waste correctly before time runs out! Learn proper recycling in this fast-paced game.',
  //   difficulty: 'medium',
  //   ecoPoints: 80,
  //   estimatedTime: '8-12 min',
  //   category: 'action',
  //   icon: '♻️',
  //   gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
  //   stars: 2,
  //   bestScore: 2100,
  // },
  {
    id: 'pick-us-right',
    title: 'Pick Us Right',
    description: 'Sort falling waste items into correct bins! Click words and pick the right dustbin.',
    difficulty: 'easy',
    ecoPoints: 60,
    estimatedTime: '5-10 min',
    category: 'puzzle',
    icon: '🗑️',
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    stars: 2,
    bestScore: 850,
  },
  {
    id: 'wildlife-rescue',
    title: 'Wildlife Rescue Mission',
    description: 'Save endangered animals from habitat destruction! Navigate through obstacles to protect wildlife.',
    difficulty: 'hard',
    ecoPoints: 120,
    estimatedTime: '15-20 min',
    category: 'adventure',
    icon: '🦁',
    gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
    stars: 3,
    bestScore: 3450,
  },
  // {
  //   id: 'eco-city-builder',
  //   title: 'Eco City Builder',
  //   description: 'Build a sustainable city! Balance growth with environmental protection in this strategy game.',
  //   difficulty: 'hard',
  //   ecoPoints: 150,
  //   estimatedTime: '20-30 min',
  //   category: 'strategy',
  //   icon: '🏙️',
  //   gradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
  //   stars: 1,
  // },
  // {
  //   id: 'eco-placement-challenge',
  //   title: 'Eco Placement Challenge',
  //   description: 'Drag & drop eco objects into a 5x5 grid! Earn points by placing trees, solar panels, and more within 2 minutes.',
  //   difficulty: 'medium',
  //   ecoPoints: 80,
  //   estimatedTime: '2-5 min',
  //   category: 'puzzle',
  //   icon: '🌍',
  //   gradient: 'bg-gradient-to-br from-green-500 to-teal-600',
  //   stars: 2,
  //   bestScore: 1500,
  // },
  // {
  //   id: 'solar-energy',
  //   title: 'Solar Energy Tycoon',
  //   description: 'Manage solar panels and power a city with renewable energy! Optimize for maximum efficiency.',
  //   difficulty: 'medium',
  //   ecoPoints: 90,
  //   estimatedTime: '12-18 min',
  //   category: 'simulation',
  //   icon: '☀️',
  //   gradient: 'bg-gradient-to-br from-[#FFD166] to-yellow-600',
  //   isLocked: true,
  // },
  // {
  //   id: 'ocean-cleanup',
  //   title: 'Ocean Cleanup Odyssey',
  //   description: 'Clean up ocean plastic pollution! Guide your cleanup boat through challenging waters.',
  //   difficulty: 'medium',
  //   ecoPoints: 100,
  //   estimatedTime: '10-15 min',
  //   category: 'action',
  //   icon: '🌊',
  //   gradient: 'bg-gradient-to-br from-cyan-500 to-blue-700',
  //   isLocked: true,
  // },
  // {
  //   id: 'forest-defender',
  //   title: 'Forest Defender',
  //   description: 'Protect the forest from deforestation! Strategic tower defense with an eco-message.',
  //   difficulty: 'hard',
  //   ecoPoints: 140,
  //   estimatedTime: '20-25 min',
  //   category: 'strategy',
  //   icon: '🌲',
  //   gradient: 'bg-gradient-to-br from-green-700 to-emerald-800',
  //   isLocked: true,
  // },
];

export function Challenges() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const categories = ['all', 'action', 'puzzle', 'strategy', 'adventure', 'simulation'];

  const filteredGames = GAMES.filter((game) => {
    const matchesSearch = 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlayGame = (gameId: string) => {
    // Navigate to specific game pages
    if (gameId === 'bubble-shooter') {
      navigate('/bubble-shooter');
    } else if (gameId === 'water-conservation') {
      navigate('/water-conservation');
    } else if (gameId === 'pick-us-right') {
      navigate('/pick-us-right');
    } else if (gameId === 'eco-placement-challenge') {
      navigate('/eco-placement-challenge');
    } else if( gameId === 'wildlife-rescue') {
      navigate('/wildlife-rescue-mission');
    } else if( gameId === 'tic-tac-toe') {
      navigate('/eco-tictactoe');
    }
    else {
      // For other games, show placeholder
      setSelectedGame(gameId);
      console.log('Playing game:', gameId);
    }
  };

  if (selectedGame) {
    return (
      <div className="min-h-screen p-6">
        <div className="container mx-auto max-w-7xl">
          <Button
            onClick={() => setSelectedGame(null)}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
          {/* Game would be rendered here */}
          <div className="glass-card rounded-3xl p-12 min-h-[600px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-3xl">Game: {selectedGame}</h2>
              <p className="text-muted-foreground">Game implementation goes here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-block">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block text-6xl mb-4"
            >
              🎮
            </motion.div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#3FB984] via-[#3069F0] to-[#FFD166] bg-clip-text text-transparent">
            Eco Games & Challenges
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn about the environment through fun, interactive games! Earn eco-points and unlock new challenges.
          </p>
        </motion.div>

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Games Played', value: '12', icon: '🎯', color: 'from-[#3FB984] to-[#2d8a5f]' },
            { label: 'Total Points', value: '1,240', icon: '⭐', color: 'from-[#FFD166] to-[#f5b93d]' },
            { label: 'Achievements', value: '8', icon: '🏆', color: 'from-[#3069F0] to-[#2451c7]' },
            { label: 'Streak Days', value: '15', icon: '🔥', color: 'from-orange-500 to-red-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div> */}

        {/* Search and Filter Section */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl border-2 focus:border-[#3FB984] transition-colors"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              className="h-12 px-6 rounded-xl border-2 hover:border-[#3FB984] transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b rounded-none p-0 h-auto gap-2">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize rounded-xl px-6 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3FB984] data-[state=active]:to-[#2d8a5f] data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GameCard game={game} onPlay={handlePlayGame} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No Games Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find more games.
            </p>
          </motion.div>
        )}

        {/* Featured Challenge Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 bg-gradient-to-r from-[#3FB984]/20 via-[#3069F0]/20 to-[#FFD166]/20 border-2 border-[#3FB984]/30"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-3">
              <Badge className="bg-gradient-to-r from-[#FFD166] to-[#f5b93d] text-gray-800">
                <Sparkles className="w-3 h-3 mr-1" />
                Weekly Challenge
              </Badge>
              <h3 className="text-3xl font-bold">  Complete 5 Sustainability Challenges!</h3>
              <p className="text-muted-foreground">
                Learn about recycling, renewable energy, and environmental protection
  by completing any 5 eco-learning activities this week.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#3FB984] to-[#2d8a5f]"
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <span className="font-semibold">3/5</span>
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
}