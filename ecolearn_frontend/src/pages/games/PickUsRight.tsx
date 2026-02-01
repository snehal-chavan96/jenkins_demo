import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Timer,
  Trophy,
  Star,
  Play,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  XCircle,
  Home,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { cn } from '../../components/ui/utils';

// Waste types
type WasteCategory = 'dry' | 'wet' | 'ewaste';

interface WasteItem {
  id: string;
  word: string;
  category: WasteCategory;
  x: number;
  y: number; // FIXED resting Y (not animated)
}


interface Level {
  level: number;
  wordCount: number;
  points: number;
  title: string;
  description: string;
}

const LEVELS: Level[] = [
  { level: 1, wordCount: 10, points: 50, title: 'Beginner Sorter', description: 'Sort 10 waste items' },
  { level: 2, wordCount: 25, points: 150, title: 'Eco Warrior', description: 'Sort 25 waste items' },
  { level: 3, wordCount: 30, points: 250, title: 'Master Recycler', description: 'Sort 30 waste items' },
];

// Waste items database
const WASTE_ITEMS = {
  dry: [
    'Paper', 'Plastic Bottle', 'Cardboard', 'Chips Packet', 'Cloth',
    'Broken Toy', 'Newspaper', 'Milk Carton', 'Wrapper', 'Dry Leaves',
    'Wood Stick', 'Tin Can', 'Glass Bottle', 'Straw', 'Bag',
    'Foam Cup', 'Tissue', 'Rubber Band', 'Cork', 'Pencil Shavings',
    'Magazine', 'Envelope', 'Cardboard Box', 'Bubble Wrap', 'Napkin',
    'Paper Plate', 'Pizza Box', 'Egg Carton', 'Aluminum Foil', 'Thread'
  ],
  wet: [
    'Food Scraps', 'Vegetable Peels', 'Fruit Leftovers', 'Eggshells', 'Tea Leaves',
    'Coffee Grounds', 'Banana Peel', 'Apple Core', 'Rice', 'Bread',
    'Pasta', 'Spoiled Milk', 'Rotten Tomato', 'Orange Peel', 'Onion Skin',
    'Potato Peels', 'Chicken Bones', 'Fish Bones', 'Coconut Shell', 'Mango Seed',
    'Watermelon Rind', 'Curry Leaves', 'Coriander Stems', 'Cabbage Leaves', 'Carrot Tops',
    'Flowers', 'Plant Cuttings', 'Grass Clippings', 'Wet Soil', 'Cooked Food'
  ],
  ewaste: [
    'Old Phone', 'Charger', 'Broken Earbuds', 'Battery', 'Remote',
    'Circuit Board', 'USB Cable', 'Old Laptop', 'Mouse', 'Keyboard',
    'Hard Drive', 'RAM Stick', 'DVD Player', 'Old Monitor', 'Printer',
    'Scanner', 'Router', 'Adapter', 'Power Bank', 'Webcam',
    'Speakers', 'Microphone', 'Game Controller', 'Smart Watch', 'Tablet',
    'Calculator', 'LED Bulb', 'Fan Motor', 'Extension Cord', 'Motherboard'
  ]
};

const ECO_FACTS = [
  "🌍 Recycling one plastic bottle can save enough energy to power a bulb for 3 hours!",
  "♻️ Composting wet waste reduces methane emissions from landfills!",
  "📱 E-waste contains valuable metals like gold, silver, and copper!",
  "🌱 Proper waste sorting can reduce landfill waste by up to 70%!",
  "💚 One ton of recycled paper saves 17 trees!",
  "🔋 Recycling batteries prevents toxic chemicals from entering soil!",
  "🌊 Plastic takes 500+ years to decompose in nature!"
];

type GameScreen = 'menu' | 'playing';

export const PickUsRight = () => {
  const navigate = useNavigate();

  // Screen state
  const [gameScreen, setGameScreen] = useState<GameScreen>('menu');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Game state
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const dryBinRef = useRef<HTMLDivElement>(null);
  const wetBinRef = useRef<HTMLDivElement>(null);
  const ewasteBinRef = useRef<HTMLDivElement>(null);

  const wasteItemStyles: Record<WasteCategory, string> = {
    dry: `
    bg-yellow-400
    bg-gradient-to-br from-yellow-400 to-yellow-300
    border-2 border-yellow-600
    text-yellow-900
  `,
    wet: `
    bg-green-500
    bg-gradient-to-br from-green-500 to-green-400
    border-2 border-green-700
    text-green-950
  `,
    ewaste: `
    bg-blue-500
    bg-gradient-to-br from-blue-500 to-blue-400
    border-2 border-blue-700
    text-blue-950
  `,
  };


  const currentLevel = selectedLevel !== null ? LEVELS[selectedLevel - 1] : null;

  // Timer
  useEffect(() => {
    if (gameScreen === 'playing' && timeLeft > 0 && correctCount < (currentLevel?.wordCount || 0)) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameFailed();
            return 0;
          }
          return prev - 1;
        });
        setTimeTaken(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameScreen, timeLeft, correctCount, currentLevel]);

  // Check completion
  useEffect(() => {
    if (correctCount === currentLevel?.wordCount && currentLevel?.wordCount > 0) {
      handleGameComplete();
    }
  }, [correctCount, currentLevel]);

  const DROP_TOP = 20;
  const DROP_BOTTOM = 320;
  const ITEM_GAP = 60;

  const generateWasteItems = (level: number): WasteItem[] => {
    const levelData = LEVELS[level - 1];
    const items: WasteItem[] = [];

    const lanes = [10, 30, 50, 70, 90];
    const laneHeights: Record<number, number> = {
      10: DROP_TOP,
      30: DROP_TOP,
      50: DROP_TOP,
      70: DROP_TOP,
      90: DROP_TOP,
    };

    const categories: WasteCategory[] = ['dry', 'wet', 'ewaste'];
    const itemsPerCategory = Math.ceil(levelData.wordCount / 3);

    let id = 0;

    categories.forEach(category => {
      const available = [...WASTE_ITEMS[category]];
      const count =
        category === 'ewaste'
          ? levelData.wordCount - itemsPerCategory * 2
          : itemsPerCategory;

      for (let i = 0; i < count && available.length; i++) {
        const word = available.splice(
          Math.floor(Math.random() * available.length),
          1
        )[0];

        let lane = lanes[id % lanes.length];
        let y = laneHeights[lane];

        //  prevent crossing into bins
        if (y + ITEM_GAP > DROP_BOTTOM) {
          // move to next lane
          lane = lanes[(lanes.indexOf(lane) + 1) % lanes.length];
          y = laneHeights[lane];
        }

        // still unsafe? clamp
        if (y + ITEM_GAP > DROP_BOTTOM) {
          y = DROP_BOTTOM - ITEM_GAP;
        }

        items.push({
          id: `waste-${id++}`,
          word,
          category,
          x: lane,
          y,
        });

        laneHeights[lane] += ITEM_GAP;
      }
    });

    return items;
  };


  const startGame = (level: number) => {
    setSelectedLevel(level);
    setWasteItems(generateWasteItems(level));
    setScore(0);
    setCorrectCount(0);
    setWrongAttempts(0);
    setTimeLeft(120);
    setTimeTaken(0);
    // setSelectedWord(null);
    setGameScreen('playing');

    // Trigger drop animation
    // setTimeout(() => {
    //   setWasteItems(prev => prev.map(item => ({ ...item, currentY: item.startY, isDropped: true })));
    // }, 100);

  };


  const isOverlapping = (a: DOMRect, b: DOMRect) => {
    return !(
      a.right < b.left ||
      a.left > b.right ||
      a.bottom < b.top ||
      a.top > b.bottom
    );
  };

  const handleDrop = (itemId: string, itemRect: DOMRect) => {
    setWasteItems(prev => {
      const item = prev.find(i => i.id === itemId);
      if (!item) return prev;

      let droppedCategory: WasteCategory | null = null;

      if (dryBinRef.current && isOverlapping(itemRect, dryBinRef.current.getBoundingClientRect()))
        droppedCategory = 'dry';
      else if (wetBinRef.current && isOverlapping(itemRect, wetBinRef.current.getBoundingClientRect()))
        droppedCategory = 'wet';
      else if (ewasteBinRef.current && isOverlapping(itemRect, ewasteBinRef.current.getBoundingClientRect()))
        droppedCategory = 'ewaste';

      if (!droppedCategory) return prev;

      if (item.category === droppedCategory) {
        setCorrectCount(c => c + 1);
        setFeedback({ type: 'success', text: 'Correct Bin! 🎉' });
        setTimeout(() => setFeedback(null), 800);
        return prev.filter(i => i.id !== itemId);
      } else {
        setWrongAttempts(w => w + 1);
        setFeedback({ type: 'error', text: 'Wrong Bin ❌' });
        setTimeout(() => setFeedback(null), 800);
        return prev;
      }
    });
  };


  const handleGameComplete = () => {
    setScore(currentLevel!.points);
    setTimeout(() => setShowCompletion(true), 500);
  };

  const handleGameFailed = () => {
    setTimeout(() => setShowFailure(true), 500);
  };

  const restartLevel = () => {
    setShowCompletion(false);
    setShowFailure(false);
    if (selectedLevel) {
      startGame(selectedLevel);
    }
  };

  const nextLevel = () => {
    setShowCompletion(false);
    if (selectedLevel && selectedLevel < LEVELS.length) {
      startGame(selectedLevel + 1);
    } else {
      backToMenu();
    }
  };

  const backToMenu = () => {
    setGameScreen('menu');
    setSelectedLevel(null);
    setShowCompletion(false);
    setShowFailure(false);
  };

  // Level Selection Menu
  if (gameScreen === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-gray-900 p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block mb-6">
              <Button
                variant="outline"
                onClick={() => navigate('/challenges')}
                className="rounded-xl border-2 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="text-8xl mb-4">♻️</div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                Pick Us Right!
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Sort waste items into the correct bins and save the planet! 🌍
              </p>
            </motion.div>
          </div>

          {/* How to Play */}
          <Card className="mb-8 border-2 border-yellow-200 dark:border-yellow-800 rounded-3xl shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-yellow-900/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-600" />
                How to Play
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl mx-auto font-bold">1</div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Click a Word</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    When words fall, click on any waste item to select it
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto font-bold">2</div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Pick the Right Bin</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Click the correct dustbin: Dry, Wet, or E-Waste
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center text-3xl mx-auto font-bold">3</div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Beat the Clock</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Sort all items within 2 minutes to win!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bin Types Guide */}
          <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800 rounded-3xl shadow-xl bg-white dark:bg-gray-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Waste Categories
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-2 border-yellow-300 dark:border-yellow-700">
                  <div className="text-6xl mb-3 text-center">🗑️</div>
                  <h3 className="text-xl font-bold text-center mb-3 text-yellow-900 dark:text-yellow-300">Dry Waste</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-3">
                    Paper, plastic, cardboard, cloth, packaging
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge className="bg-yellow-500 text-white">Paper</Badge>
                    <Badge className="bg-yellow-500 text-white">Plastic</Badge>
                    <Badge className="bg-yellow-500 text-white">Cardboard</Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border-2 border-green-300 dark:border-green-700">
                  <div className="text-6xl mb-3 text-center">🥬</div>
                  <h3 className="text-xl font-bold text-center mb-3 text-green-900 dark:text-green-300">Wet Waste</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-3">
                    Food scraps, vegetable peels, organic matter
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge className="bg-green-500 text-white">Food</Badge>
                    <Badge className="bg-green-500 text-white">Peels</Badge>
                    <Badge className="bg-green-500 text-white">Organic</Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-2 border-blue-300 dark:border-blue-700">
                  <div className="text-6xl mb-3 text-center">📱</div>
                  <h3 className="text-xl font-bold text-center mb-3 text-blue-900 dark:text-blue-300">E-Waste</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-3">
                    Electronics, batteries, chargers, gadgets
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge className="bg-blue-500 text-white">Phone</Badge>
                    <Badge className="bg-blue-500 text-white">Battery</Badge>
                    <Badge className="bg-blue-500 text-white">Charger</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Selection */}
          <div className="grid md:grid-cols-3 gap-6">
            {LEVELS.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="border-4 border-green-200 dark:border-green-800 rounded-3xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-3xl transition-all bg-white dark:bg-gray-800">
                  <CardContent className="p-0">
                    {/* Level Badge */}
                    <div className={cn(
                      "p-6 text-center relative",
                      level.level === 1 && "bg-gradient-to-br from-green-400 to-emerald-500",
                      level.level === 2 && "bg-gradient-to-br from-yellow-400 to-orange-500",
                      level.level === 3 && "bg-gradient-to-br from-purple-400 to-pink-500"
                    )}>
                      <div className="text-7xl mb-2">
                        {level.level === 1 && '🌱'}
                        {level.level === 2 && '🌿'}
                        {level.level === 3 && '🌳'}
                      </div>
                      <Badge className="bg-white/90 text-gray-900 text-lg px-4 py-1">
                        Level {level.level}
                      </Badge>
                    </div>

                    {/* Level Details */}
                    <div className="p-6 space-y-4">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {level.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {level.description}
                        </p>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Items to Sort</span>
                          <Badge variant="outline" className="text-base">{level.wordCount}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Time Limit</span>
                          <Badge variant="outline">2:00</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Points</span>
                          <Badge className="bg-yellow-500 text-white text-base">{level.points}</Badge>
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => startGame(level.level)}
                          className={cn(
                            "w-full rounded-xl text-white shadow-lg text-lg py-6",
                            level.level === 1 && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                            level.level === 2 && "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700",
                            level.level === 3 && "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                          )}
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Start Level {level.level}
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-gray-900 overflow-hidden">
      {/* Top Game Bar */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b-4 border-green-300 dark:border-green-800 shadow-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left */}
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={backToMenu}
                  className="rounded-xl border-2 border-green-300 dark:border-green-700"
                  size="sm"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Menu
                </Button>
              </motion.div>

              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  ♻️ {currentLevel?.title}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Sort {correctCount}/{currentLevel?.wordCount} items
                </p>
              </div>
            </div>

            {/* Center: Timer */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className={cn(
                      timeLeft > 60 ? "text-green-500" : timeLeft > 30 ? "text-yellow-500" : "text-red-500"
                    )}
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - timeLeft / 120)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/60 dark:to-orange-900/60 px-4 py-2 rounded-xl border-2 border-yellow-300 dark:border-yellow-700">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{currentLevel?.points}</div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSoundOn(!isSoundOn)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-700 border-2 border-purple-300 dark:border-purple-700 shadow-md"
              >
                {isSoundOn ? (
                  <Volume2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                ) : (
                  <VolumeX className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Sorting Progress</span>
              <span>{correctCount} / {currentLevel?.wordCount} sorted</span>
            </div>
            <Progress value={(correctCount / (currentLevel?.wordCount || 1)) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              'fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-bold text-white shadow-lg z-50',
              feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            )}
          >
            {feedback.text}
          </motion.div>
        )}

      </AnimatePresence>

      {/* Game Area */}
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-200px)] relative">
        {/* Falling Words Area */}
        <div className="relative h-full mb-4 overflow-visible">
          {wasteItems.map((item, index) => (
            <motion.div
  key={item.id}
  drag
  dragMomentum={false}
  onDragEnd={(e) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    handleDrop(item.id, rect);
  }}
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: item.y, opacity: 1 }}
  transition={{ duration: 0.7, ease: 'easeOut' }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  style={{
    position: 'absolute',
    top: 0,
    left: `${item.x}%`,
    transform: 'translateX(-50%)',
  }}
  className="cursor-grab active:cursor-grabbing z-20"
>

              <div
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold shadow-lg",
                  "select-none whitespace-nowrap",
                  "transition-all duration-200",
                  "hover:shadow-2xl",
                  wasteItemStyles[item.category]
                )}
              >
                {item.word}
              </div>
            </motion.div>

          ))}

        </div>

        {/* Floor Line */}
        <div className="absolute bottom-32 left-0 right-0 h-1 bg-black" />

        {/* Dustbins */}
        <div className="absolute bottom-0 left-0 right-0 py-4">
          <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Dry Waste Bin */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              ref={dryBinRef}
              whileTap={{ scale: 0.95 }}

              className="cursor-pointer"
            >
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 shadow-2xl border-4 border-yellow-600 hover:shadow-3xl transition-all">
                <div className="text-7xl text-center mb-2">🗑️</div>
                <h3 className="text-2xl font-bold text-center text-white mb-1">Dry Waste</h3>
                <p className="text-sm text-center text-yellow-100">Paper, Plastic, Cardboard</p>
              </div>
            </motion.div>

            {/* Wet Waste Bin */}
            <motion.div
              ref={wetBinRef}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}

              className="cursor-pointer"
            >
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-6 shadow-2xl border-4 border-green-600 hover:shadow-3xl transition-all">
                <div className="text-7xl text-center mb-2">🥬</div>
                <h3 className="text-2xl font-bold text-center text-white mb-1">Wet Waste</h3>
                <p className="text-sm text-center text-green-100">Food, Peels, Organic</p>
              </div>
            </motion.div>

            {/* E-Waste Bin */}
            <motion.div
              ref={ewasteBinRef}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}

              className="cursor-pointer"
            >
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl p-6 shadow-2xl border-4 border-blue-600 hover:shadow-3xl transition-all">
                <div className="text-7xl text-center mb-2">📱</div>
                <h3 className="text-2xl font-bold text-center text-white mb-1">E-Waste</h3>
                <p className="text-sm text-center text-blue-100">Electronics, Batteries</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-green-300 dark:border-green-700 relative overflow-hidden"
            >
              {/* Confetti Effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: ['#4ade80', '#fbbf24', '#3b82f6', '#ec4899'][i % 4],
                    left: `${Math.random() * 100}%`,
                    top: -20,
                  }}
                  animate={{
                    y: [0, 600],
                    rotate: [0, 360],
                    opacity: [1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: 2
                  }}
                />
              ))}

              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-center mb-6 relative z-10"
              >
                <div className="text-9xl mb-4">🎉</div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
                  Great Job!
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">You sorted everything correctly! 🌍</p>
              </motion.div>

              <div className="space-y-4 mb-6 relative z-10">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-green-200 dark:border-green-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      Time Taken
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Wrong Attempts
                    </span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {wrongAttempts}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                        Level Score
                      </span>
                      <span className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                        {score}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border-2 border-green-300 dark:border-green-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-900 dark:text-green-300">💡 Eco Fact</span>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                    {ECO_FACTS[Math.floor(Math.random() * ECO_FACTS.length)]}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    onClick={backToMenu}
                    variant="outline"
                    className="w-full rounded-xl border-2 border-green-300 dark:border-green-700 text-lg py-6"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Menu
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    onClick={nextLevel}
                    className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-6"
                  >
                    {selectedLevel && selectedLevel < LEVELS.length ? (
                      <>
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Next Level
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Complete
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Failure Modal */}
      <AnimatePresence>
        {showFailure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-red-300 dark:border-red-700"
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <div className="text-8xl mb-4">⏳</div>
                </motion.div>
                <h2 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Time's Up!
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Try again to sort all items correctly!
                </p>
              </div>

              <div className="bg-red-100 dark:bg-red-900/20 rounded-2xl p-6 mb-6 border-2 border-red-200 dark:border-red-800">
                <div className="space-y-3 text-center">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Items Sorted</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {correctCount} / {currentLevel?.wordCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Wrong Attempts</div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{wrongAttempts}</div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 mb-6 border-2 border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-900 dark:text-orange-200 text-center">
                  💡 <strong>Tip:</strong> Remember - Paper goes to Dry, Food to Wet, and Electronics to E-Waste!
                </p>
              </div>

              <div className="flex gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    onClick={backToMenu}
                    variant="outline"
                    className="w-full rounded-xl border-2 border-red-300 dark:border-red-700 text-lg py-6"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Menu
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                  <Button
                    onClick={restartLevel}
                    className="w-full rounded-xl bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-lg py-6"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Try Again
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
