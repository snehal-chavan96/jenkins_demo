import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Trophy, 
  ArrowLeft, 
  Play, 
  RotateCcw,
  Sparkles,
  Target,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface EcoObject {
  id: string;
  name: string;
  icon: string;
  points: number;
  color: string;
}

interface GridCell {
  row: number;
  col: number;
  object: EcoObject | null;
}

const ecoObjects: EcoObject[] = [
  { id: 'tree', name: 'Tree', icon: '🌳', points: 10, color: 'from-green-400 to-green-600' },
  { id: 'building', name: 'Building', icon: '🏢', points: 5, color: 'from-gray-400 to-gray-600' },
  { id: 'bike', name: 'Bike', icon: '🚲', points: 4, color: 'from-blue-400 to-blue-600' },
  { id: 'bus', name: 'Bus', icon: '🚌', points: 6, color: 'from-yellow-400 to-orange-600' },
  { id: 'car', name: 'Car', icon: '🚗', points: -2, color: 'from-red-400 to-red-600' },
  { id: 'solar', name: 'Solar Panel', icon: '☀️', points: 7, color: 'from-orange-400 to-yellow-600' },
  { id: 'garden', name: 'Garden', icon: '🌺', points: 8, color: 'from-pink-400 to-purple-600' },
  { id: 'recycle', name: 'Recycling Centre', icon: '♻️', points: 10, color: 'from-emerald-400 to-teal-600' },
];

export const EcoPlacementChallenge = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'ended'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [availableObjects, setAvailableObjects] = useState<EcoObject[]>([]);
  const [draggedObject, setDraggedObject] = useState<EcoObject | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize grid (5x5)
  useEffect(() => {
    const initialGrid: GridCell[][] = [];
    for (let row = 0; row < 5; row++) {
      const rowCells: GridCell[] = [];
      for (let col = 0; col < 5; col++) {
        rowCells.push({ row, col, object: null });
      }
      initialGrid.push(rowCells);
    }
    setGrid(initialGrid);

    // Generate 30 random objects
    const objects: EcoObject[] = [];
    for (let i = 0; i < 30; i++) {
      const randomObject = ecoObjects[Math.floor(Math.random() * ecoObjects.length)];
      objects.push({ ...randomObject, id: `${randomObject.id}-${i}` });
    }
    setAvailableObjects(objects);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('ended');
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(120);
    
    // Reset grid
    const newGrid: GridCell[][] = [];
    for (let row = 0; row < 5; row++) {
      const rowCells: GridCell[] = [];
      for (let col = 0; col < 5; col++) {
        rowCells.push({ row, col, object: null });
      }
      newGrid.push(rowCells);
    }
    setGrid(newGrid);

    // Regenerate objects
    const objects: EcoObject[] = [];
    for (let i = 0; i < 30; i++) {
      const randomObject = ecoObjects[Math.floor(Math.random() * ecoObjects.length)];
      objects.push({ ...randomObject, id: `${randomObject.id}-${i}` });
    }
    setAvailableObjects(objects);
  };

  const handleDragStart = (object: EcoObject) => {
    setDraggedObject(object);
  };

  const handleDragEnd = () => {
    setDraggedObject(null);
    setHoveredCell(null);
  };

  const handleDrop = (row: number, col: number) => {
    if (!draggedObject || gameState !== 'playing') return;

    // Check if cell is empty
    if (grid[row][col].object !== null) return;

    // Place object in grid
    const newGrid = [...grid];
    newGrid[row][col] = { row, col, object: draggedObject };
    setGrid(newGrid);

    // Update score
    setScore(prev => prev + draggedObject.points);

    // Remove object from available objects
    setAvailableObjects(prev => prev.filter(obj => obj.id !== draggedObject.id));

    setDraggedObject(null);
    setHoveredCell(null);
  };

  const handleCellDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (grid[row][col].object === null) {
      setHoveredCell({ row, col });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 60) return 'text-green-600 dark:text-green-400';
    if (timeLeft > 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:py-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/challenges')}
            className="rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Games
          </Button>

          {gameState === 'playing' && (
            <Button
              variant="outline"
              onClick={startGame}
              className="rounded-xl border-2 border-green-500"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          )}
        </div>

        {/* Title Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-2 border-green-200 dark:border-green-700 rounded-3xl shadow-2xl bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Title */}
                <div className="flex items-center gap-3">
                  <div className="text-5xl">🏙️</div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                      Eco Placement Challenge
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Drag & drop eco objects into the grid before time runs out!
                    </p>
                  </div>
                </div>

                {/* Timer & Score */}
                <div className="flex items-center gap-4">
                  {/* Timer */}
                  <Card className={`border-2 ${
                    timeLeft > 60 ? 'border-green-300 dark:border-green-700' :
                    timeLeft > 30 ? 'border-yellow-300 dark:border-yellow-700' :
                    'border-red-300 dark:border-red-700'
                  } rounded-2xl shadow-lg`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Timer className={`h-6 w-6 ${getTimeColor()}`} />
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Time Left</p>
                          <p className={`text-2xl font-bold ${getTimeColor()}`}>
                            {formatTime(timeLeft)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Score */}
                  <Card className="border-2 border-blue-300 dark:border-blue-700 rounded-2xl shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Score</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {score}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Start Screen */}
        <AnimatePresence>
          {gameState === 'start' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center py-20"
            >
              <Card className="border-2 border-green-200 dark:border-green-700 rounded-3xl shadow-2xl bg-white dark:bg-gray-800 max-w-2xl">
                <CardContent className="p-12 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-9xl mb-6"
                  >
                    🌍
                  </motion.div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Ready to Build an Eco City?
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Place eco-friendly objects on the 5x5 grid to earn points! <br/>
                    You have 2 minutes to maximize your score. 🏆
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border-2 border-green-200 dark:border-green-700">
                      <p className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Good Objects:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Trees, Solar Panels, Gardens, Recycling Centres give positive points!</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border-2 border-red-200 dark:border-red-700">
                      <p className="font-semibold text-red-900 dark:text-red-100 mb-2">⚠️ Watch Out:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">Cars give negative points! Choose wisely to maximize your score.</p>
                    </div>
                  </div>

                  <Button
                    onClick={startGame}
                    className="h-16 px-12 text-xl rounded-2xl bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 shadow-xl"
                  >
                    <Play className="mr-3 h-6 w-6" />
                    Start Game
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Area */}
        {gameState !== 'start' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Game Grid - Left Side */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-green-200 dark:border-green-700 rounded-3xl shadow-xl bg-white dark:bg-gray-800">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                      Eco Grid (5×5)
                    </h2>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full">
                      {grid.flat().filter(cell => cell.object !== null).length} / 25 Placed
                    </Badge>
                  </div>

                  {/* Grid */}
                  <div className="aspect-square max-w-2xl mx-auto">
                    <div className="grid grid-cols-5 gap-3 h-full">
                      {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                          <motion.div
                            key={`${rowIndex}-${colIndex}`}
                            className={`relative aspect-square rounded-2xl border-3 transition-all ${
                              cell.object
                                ? 'border-green-400 dark:border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
                                : hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex
                                ? 'border-green-400 dark:border-green-500 border-dashed bg-green-100/50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20'
                            } shadow-md hover:shadow-lg cursor-pointer`}
                            onDragOver={(e) => handleCellDragOver(e, rowIndex, colIndex)}
                            onDrop={() => handleDrop(rowIndex, colIndex)}
                            onDragLeave={() => setHoveredCell(null)}
                            whileHover={{ scale: cell.object ? 1 : 1.05 }}
                          >
                            {cell.object ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center"
                              >
                                <span className="text-4xl md:text-5xl">{cell.object.icon}</span>
                                <Badge className={`mt-1 bg-gradient-to-r ${cell.object.color} text-white text-xs`}>
                                  {cell.object.points > 0 ? '+' : ''}{cell.object.points}
                                </Badge>
                              </motion.div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-700">
                                <Sparkles className="h-8 w-8 opacity-30" />
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Objects Panel - Right Side */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-blue-200 dark:border-blue-700 rounded-3xl shadow-xl bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Eco Objects
                    </h2>
                    <Badge className="bg-blue-500 text-white rounded-full px-3 py-1">
                      {availableObjects.length} Left
                    </Badge>
                  </div>

                  {/* Scrollable Objects Grid */}
                  <div className="h-[600px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-200 dark:scrollbar-thumb-green-600 dark:scrollbar-track-gray-800">
                    {availableObjects.length > 0 ? (
                      availableObjects.map((object) => (
                        <motion.div
                          key={object.id}
                          draggable={gameState === 'playing'}
                          onDragStart={() => handleDragStart(object)}
                          onDragEnd={handleDragEnd}
                          className={`relative p-4 rounded-xl border-2 cursor-move transition-all ${
                            draggedObject?.id === object.id
                              ? 'border-green-400 dark:border-green-600 opacity-50 scale-95'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600'
                          } bg-gradient-to-br ${object.color} shadow-md hover:shadow-xl`}
                          whileHover={{ scale: draggedObject?.id === object.id ? 0.95 : 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{object.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-white text-sm">{object.name}</p>
                              <Badge className={`mt-1 ${
                                object.points > 0 
                                  ? 'bg-white/90 text-green-700' 
                                  : 'bg-white/90 text-red-700'
                              } font-bold`}>
                                {object.points > 0 ? '+' : ''}{object.points} pts
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-6xl mb-4">🎉</p>
                        <p className="text-gray-600 dark:text-gray-400 font-semibold">
                          All objects placed!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        <AnimatePresence>
          {gameState === 'ended' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
              >
                <Card className="border-2 border-green-200 dark:border-green-700 rounded-3xl shadow-2xl bg-white dark:bg-gray-800 max-w-lg">
                  <CardContent className="p-12 text-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 1 }}
                      className="text-8xl mb-6"
                    >
                      {score >= 100 ? '🏆' : score >= 50 ? '⭐' : '🎯'}
                    </motion.div>
                    
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      Time's Up!
                    </h2>
                    
                    <div className="mb-8">
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                        Final Score
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                        <p className="text-6xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                          {score}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {score >= 100 ? '🎉 Outstanding! Eco Champion!' :
                         score >= 50 ? '✨ Great job! Keep it up!' :
                         '💪 Good try! Play again to improve!'}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/challenges')}
                        className="flex-1 h-12 rounded-xl border-2"
                      >
                        Back to Games
                      </Button>
                      <Button
                        onClick={startGame}
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Play Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
