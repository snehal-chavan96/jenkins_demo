import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Sparkles, 
  Heart,
  CheckCircle,
  XCircle,
  Leaf,
  Award,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import confetti from 'canvas-confetti';

// Animal and habitat data (25 animals with their habitats)
const ANIMAL_DATA = [
  // African Animals
  { id: 1, name: 'Lion', emoji: '🦁', habitat: 'African Savanna', habitatEmoji: '🌾', continent: 'Africa' },
  { id: 2, name: 'Elephant', emoji: '🐘', habitat: 'African Savanna', habitatEmoji: '🌾', continent: 'Africa' },
  { id: 3, name: 'Zebra', emoji: '🦓', habitat: 'African Grasslands', habitatEmoji: '🌿', continent: 'Africa' },
  { id: 4, name: 'Giraffe', emoji: '🦒', habitat: 'African Savanna', habitatEmoji: '🌾', continent: 'Africa' },
  
  // Asian Animals
  { id: 5, name: 'Tiger', emoji: '🐅', habitat: 'Asian Rainforest', habitatEmoji: '🌴', continent: 'Asia' },
  { id: 6, name: 'Panda', emoji: '🐼', habitat: 'Bamboo Forest', habitatEmoji: '🎋', continent: 'Asia' },
  { id: 7, name: 'Orangutan', emoji: '🦧', habitat: 'Tropical Rainforest', habitatEmoji: '🌳', continent: 'Asia' },
  { id: 8, name: 'Snow Leopard', emoji: '🐆', habitat: 'Mountain Ranges', habitatEmoji: '⛰️', continent: 'Asia' },
  
  // Ocean Animals
  { id: 9, name: 'Dolphin', emoji: '🐬', habitat: 'Ocean Waters', habitatEmoji: '🌊', continent: 'Global' },
  { id: 10, name: 'Whale', emoji: '🐋', habitat: 'Deep Ocean', habitatEmoji: '🌊', continent: 'Global' },
  { id: 11, name: 'Sea Turtle', emoji: '🐢', habitat: 'Coastal Ocean', habitatEmoji: '🏖️', continent: 'Global' },
  { id: 12, name: 'Shark', emoji: '🦈', habitat: 'Ocean Waters', habitatEmoji: '🌊', continent: 'Global' },
  
  // Arctic Animals
  { id: 13, name: 'Polar Bear', emoji: '🐻‍❄️', habitat: 'Arctic Ice', habitatEmoji: '❄️', continent: 'Arctic' },
  { id: 14, name: 'Penguin', emoji: '🐧', habitat: 'Antarctic Ice', habitatEmoji: '🧊', continent: 'Antarctica' },
  { id: 15, name: 'Seal', emoji: '🦭', habitat: 'Arctic Waters', habitatEmoji: '🧊', continent: 'Arctic' },
  
  // Forest Animals
  { id: 16, name: 'Bear', emoji: '🐻', habitat: 'Temperate Forest', habitatEmoji: '🌲', continent: 'North America' },
  { id: 17, name: 'Wolf', emoji: '🐺', habitat: 'Boreal Forest', habitatEmoji: '🌲', continent: 'North America' },
  { id: 18, name: 'Fox', emoji: '🦊', habitat: 'Woodland Forest', habitatEmoji: '🌳', continent: 'Europe' },
  { id: 19, name: 'Deer', emoji: '🦌', habitat: 'Forest Meadow', habitatEmoji: '🌲', continent: 'North America' },
  
  // Australian Animals
  { id: 20, name: 'Kangaroo', emoji: '🦘', habitat: 'Australian Outback', habitatEmoji: '🏜️', continent: 'Australia' },
  { id: 21, name: 'Koala', emoji: '🐨', habitat: 'Eucalyptus Forest', habitatEmoji: '🌳', continent: 'Australia' },
  
  // South American Animals
  { id: 22, name: 'Sloth', emoji: '🦥', habitat: 'Amazon Rainforest', habitatEmoji: '🌴', continent: 'South America' },
  { id: 23, name: 'Jaguar', emoji: '🐆', habitat: 'Jungle Canopy', habitatEmoji: '🌴', continent: 'South America' },
  { id: 24, name: 'Macaw', emoji: '🦜', habitat: 'Tropical Canopy', habitatEmoji: '🌴', continent: 'South America' },
  
  // Freshwater Animals
  { id: 25, name: 'Crocodile', emoji: '🐊', habitat: 'River & Swamps', habitatEmoji: '💧', continent: 'Global' },
];

interface Animal {
  id: number;
  name: string;
  emoji: string;
  habitat: string;
  habitatEmoji: string;
  continent: string;
  matched?: boolean;
}

interface GameState {
  level: number;
  score: number;
  lives: number;
  selectedAnimal: Animal | null;
  selectedHabitat: string | null;
  matches: number;
  totalMatches: number;
  gameAnimals: Animal[];
  gameHabitats: Array<{ habitat: string; habitatEmoji: string; matched?: boolean }>;
}

const LEVEL_CONFIG = [
  { level: 1, animalCount: 5, points: 100, lives: 10 },
  { level: 2, animalCount: 7, points: 200, lives: 9 },
  { level: 3, animalCount: 9, points: 300, lives: 8 },
  { level: 4, animalCount: 12, points: 500, lives: 7 },
];

export const WildlifeRescueMission = () => {
  const navigate = useNavigate();
const [gameState, setGameState] = useState<GameState>({
  level: 1,
  score: 0,
  lives: LEVEL_CONFIG[0].lives,
  selectedAnimal: null,
  selectedHabitat: null,
  matches: 0,
  totalMatches: LEVEL_CONFIG[0].animalCount,
  gameAnimals: [],
  gameHabitats: [],
});


  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: '',
  });

  // Initialize level
  useEffect(() => {
    initializeLevel(gameState.level);
  }, []);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeLevel = (level: number) => {
    const config = LEVEL_CONFIG[level - 1];
    
    // Randomly select animals for this level
    const shuffledAnimals = shuffleArray([...ANIMAL_DATA]);
    const selectedAnimals = shuffledAnimals.slice(0, config.animalCount);
    
    // Shuffle animals for display
    const gameAnimals = shuffleArray(selectedAnimals);
    
    // Create unique habitats list and shuffle
    const uniqueHabitats = Array.from(
      new Set(selectedAnimals.map(a => a.habitat))
    ).map(habitat => {
      const animal = selectedAnimals.find(a => a.habitat === habitat);
      return {
        habitat,
        habitatEmoji: animal?.habitatEmoji || '🌍',
        matched: false,
      };
    });
    
    const gameHabitats = shuffleArray(uniqueHabitats);

    setGameState({
      level,
      score: gameState.score,
      lives: config.lives,
      selectedAnimal: null,
      selectedHabitat: null,
      matches: 0,
      totalMatches: config.animalCount,
      gameAnimals: gameAnimals.map(a => ({ ...a, matched: false })),
      gameHabitats,
    });
    
    setShowLevelComplete(false);
    setShowGameOver(false);
  };

  const handleAnimalClick = (animal: Animal) => {
    if (animal.matched || gameState.selectedAnimal?.id === animal.id) return;
    
    setGameState(prev => ({
      ...prev,
      selectedAnimal: animal,
      selectedHabitat: null,
    }));
  };

  const handleHabitatClick = (habitat: string) => {
    if (!gameState.selectedAnimal) {
      setFeedback({
        show: true,
        correct: false,
        message: 'Please select an animal first! 🦁',
      });
      setTimeout(() => setFeedback({ show: false, correct: false, message: '' }), 2000);
      return;
    }

    const isCorrect = gameState.selectedAnimal.habitat === habitat;

if (isCorrect) {
    setFeedback({
    show: true,
    correct: true,
    message: `Correct! ${gameState.selectedAnimal.name} lives in ${habitat}! ✅`,
  });
  setTimeout(() => setFeedback({ show: false, correct: false, message: '' }), 2000);


  const config = LEVEL_CONFIG[gameState.level - 1];
  const pointsEarned = Math.floor(config.points / config.animalCount);

  const updatedAnimals = gameState.gameAnimals.map(a =>
    a.id === gameState.selectedAnimal!.id
      ? { ...a, matched: true }
      : a
  );

  const updatedHabitats = gameState.gameHabitats.map(h =>
    h.habitat === habitat
      ? { ...h, matched: true }
      : h
  );

  setGameState(prev => {
    const newMatches = prev.matches + 1;

    // ✅ LEVEL COMPLETE CHECK (CORRECT PLACE)
    if (newMatches === prev.totalMatches) {
      setTimeout(() => {
        if (prev.level < 4) {
          setShowLevelComplete(true);
        } else {
          setShowVictory(true);
        }
      }, 500);
    }

    return {
      ...prev,
      gameAnimals: updatedAnimals,
      gameHabitats: updatedHabitats,
      matches: newMatches,
      score: prev.score + pointsEarned,
      selectedAnimal: null,
      selectedHabitat: null,
    };
  });
}
 else {
      // Wrong match
      setFeedback({
        show: true,
        correct: false,
        message: `Oops! ${gameState.selectedAnimal.name} doesn't live in ${habitat}. Try again! ❌`,
      });

      const newLives = gameState.lives - 1;
      
      setGameState(prev => ({
        ...prev,
        lives: newLives,
        selectedAnimal: null,
        selectedHabitat: null,
      }));

      // Check game over
      if (newLives <= 0) {
        setTimeout(() => {
          setShowGameOver(true);
        }, 1500);
      }

      setTimeout(() => setFeedback({ show: false, correct: false, message: '' }), 3000);
    }
  };

  const handleNextLevel = () => {
    initializeLevel(gameState.level + 1);
  };

const handleRetry = () => {
  setGameState({
    level: 1,
    score: 0,
    lives: LEVEL_CONFIG[0].lives,
    selectedAnimal: null,
    selectedHabitat: null,
    matches: 0,
    totalMatches: LEVEL_CONFIG[0].animalCount,
    gameAnimals: [],
    gameHabitats: [],
  });
  setShowGameOver(false);
  initializeLevel(1);
};


  const handlePlayAgain = () => {
    handleRetry();
    setShowVictory(false);
  };

  const config = LEVEL_CONFIG[gameState.level - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300 px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/challenges')}
              className="rounded-2xl border-2 border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/30"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Games
            </Button>

            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-lg rounded-full">
                <Trophy className="mr-1 h-5 w-5" />
                {gameState.score}
              </Badge>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-5xl">🦁</span>
              <h1 className="text-4xl sm:text-5xl text-gray-900 dark:text-white">
                Wildlife Rescue Mission
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Match animals with their natural habitats!
            </p>
          </div>

          {/* Game Stats */}
          <Card className="border-2 border-orange-200 dark:border-orange-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Level */}
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-900 dark:text-white">
                    Level {gameState.level}/4
                  </span>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-900 dark:text-white">
                    {gameState.matches}/{gameState.totalMatches} Matched
                  </span>
                </div>

                {/* Lives */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: config.lives }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`h-6 w-6 ${
                        i < gameState.lives
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Points for this level */}
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-500" />
                  <span className="text-gray-900 dark:text-white">
                    {config.points} EcoPoints
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feedback Message */}
        <AnimatePresence>
          {feedback.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card
                className={`border-2 rounded-2xl ${
                  feedback.correct
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <CardContent className="p-4 text-center">
                  <p className={`text-lg ${
                    feedback.correct
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {feedback.message}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Animals Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-blue-200 dark:border-blue-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🦁</span>
                  <h2 className="text-2xl text-gray-900 dark:text-white">Animals</h2>
                </div>
                <div className="space-y-3">
                  {gameState.gameAnimals.map((animal, index) => (
                    <motion.div
                      key={animal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={!animal.matched ? { scale: 1.02, x: 5 } : {}}
                      onClick={() => handleAnimalClick(animal)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        animal.matched
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 opacity-60'
                          : gameState.selectedAnimal?.id === animal.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-500 shadow-lg scale-105'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{animal.emoji}</span>
                          <div>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {animal.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {animal.continent}
                            </p>
                          </div>
                        </div>
                        {animal.matched && (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Habitats Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-green-200 dark:border-green-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🌍</span>
                  <h2 className="text-2xl text-gray-900 dark:text-white">Habitats</h2>
                </div>
                <div className="space-y-3">
                  {gameState.gameHabitats.map((habitat, index) => (
                    <motion.div
                      key={habitat.habitat}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={!habitat.matched ? { scale: 1.02, x: -5 } : {}}
                      onClick={() => handleHabitatClick(habitat.habitat)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        habitat.matched
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 opacity-60'
                          : gameState.selectedHabitat === habitat.habitat
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-500 shadow-lg scale-105'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{habitat.habitatEmoji}</span>
                          <p className="text-lg text-gray-900 dark:text-white">
                            {habitat.habitat}
                          </p>
                        </div>
                        {habitat.matched && (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="border-2 border-purple-200 dark:border-purple-700 rounded-2xl bg-purple-50/50 dark:bg-purple-900/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1" />
                <div>
                  <p className="text-gray-900 dark:text-white mb-2">
                    <strong>How to Play:</strong>
                  </p>
                  <ol className="text-gray-700 dark:text-gray-300 space-y-1 ml-4 list-decimal">
                    <li>Click on an animal from the left column</li>
                    <li>Then click on its matching habitat from the right column</li>
                    <li>Correct matches earn you EcoPoints!</li>
                    <li>Wrong matches cost you a life ❤️</li>
                    <li>Match all animals to complete the level!</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Level Complete Modal */}
      <AnimatePresence>
        {showLevelComplete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md"
            >
              <Card className="border-4 border-yellow-300 dark:border-yellow-700 rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-8xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <h2 className="text-3xl text-gray-900 dark:text-white mb-2">
                    Level {gameState.level} Complete!
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Amazing work! You saved all the animals!
                  </p>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <span className="text-2xl text-green-600 dark:text-green-400">
                        +{config.points} EcoPoints
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Score: {gameState.score}
                    </p>
                  </div>

                  <Button
                    onClick={handleNextLevel}
                    className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg py-6 shadow-lg"
                  >
                    Next Level
                    <Star className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {showGameOver && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md"
            >
              <Card className="border-4 border-red-300 dark:border-red-700 rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className="text-8xl mb-4">😢</div>
                  <h2 className="text-3xl text-gray-900 dark:text-white mb-2">
                    Game Over
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    No more lives left! But don't give up!
                  </p>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Final Score
                    </p>
                    <p className="text-3xl text-purple-600 dark:text-purple-400">
                      {gameState.score}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate('/challenges')}
                      variant="outline"
                      className="flex-1 rounded-2xl border-2"
                    >
                      Exit
                    </Button>
                    <Button
                      onClick={handleRetry}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Victory Modal */}
      <AnimatePresence>
        {showVictory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md"
            >
              <Card className="border-4 border-green-300 dark:border-green-700 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                    className="text-8xl mb-4"
                  >
                    🏆
                  </motion.div>
                  <h2 className="text-3xl text-gray-900 dark:text-white mb-2">
                    Mission Complete! 
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    You've rescued all the wildlife! 🌍
                  </p>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 mb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Total Score:</span>
                      <span className="text-2xl text-purple-600 dark:text-purple-400">
                        {gameState.score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Levels Completed:</span>
                      <span className="text-2xl text-blue-600 dark:text-blue-400">
                        4/4
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-xl text-yellow-600 dark:text-yellow-400">
                        Wildlife Hero!
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate('/challenges')}
                      variant="outline"
                      className="flex-1 rounded-2xl border-2"
                    >
                      Exit
                    </Button>
                    <Button
                      onClick={handlePlayAgain}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Play Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
