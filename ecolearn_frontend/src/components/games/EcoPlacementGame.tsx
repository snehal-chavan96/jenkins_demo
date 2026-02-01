import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TreeDeciduous, 
  Building2, 
  Bike, 
  Bus, 
  Car, 
  Sun, 
  Flower2, 
  Recycle,
  Timer,
  Trophy,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

// Define eco objects with their properties
const ECO_OBJECTS = [
  { id: 'tree', name: 'Tree', icon: TreeDeciduous, points: 10, color: 'from-green-500 to-green-600' },
  { id: 'building', name: 'Building', icon: Building2, points: 5, color: 'from-slate-500 to-slate-600' },
  { id: 'bike', name: 'Bike', icon: Bike, points: 4, color: 'from-blue-500 to-blue-600' },
  { id: 'bus', name: 'Bus', icon: Bus, points: 6, color: 'from-yellow-500 to-yellow-600' },
  { id: 'car', name: 'Car', icon: Car, points: -2, color: 'from-red-500 to-red-600' },
  { id: 'solar', name: 'Solar Panel', icon: Sun, points: 7, color: 'from-orange-500 to-orange-600' },
  { id: 'garden', name: 'Garden', icon: Flower2, points: 8, color: 'from-pink-500 to-pink-600' },
  { id: 'recycle', name: 'Recycling Centre', icon: Recycle, points: 10, color: 'from-emerald-500 to-emerald-600' },
];

// Generate 30 random objects
const generateObjects = () => {
  const objects = [];
  for (let i = 0; i < 30; i++) {
    const randomObj = ECO_OBJECTS[Math.floor(Math.random() * ECO_OBJECTS.length)];
    objects.push({
      ...randomObj,
      uniqueId: `${randomObj.id}-${i}`,
    });
  }
  return objects;
};

type GridCell = {
  row: number;
  col: number;
  object: typeof ECO_OBJECTS[0] & { uniqueId: string } | null;
};

export const EcoPlacementGame = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [availableObjects, setAvailableObjects] = useState<(typeof ECO_OBJECTS[0] & { uniqueId: string })[]>([]);
  const [draggedObject, setDraggedObject] = useState<(typeof ECO_OBJECTS[0] & { uniqueId: string }) | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Initialize grid
  useEffect(() => {
    const newGrid: GridCell[][] = [];
    for (let i = 0; i < 5; i++) {
      const row: GridCell[] = [];
      for (let j = 0; j < 5; j++) {
        row.push({ row: i, col: j, object: null });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setAvailableObjects(generateObjects());
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('ended');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  // Start game
  const handleStartGame = () => {
    setGameState('playing');
    setTimeLeft(120);
    setScore(0);
    const newGrid: GridCell[][] = [];
    for (let i = 0; i < 5; i++) {
      const row: GridCell[] = [];
      for (let j = 0; j < 5; j++) {
        row.push({ row: i, col: j, object: null });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setAvailableObjects(generateObjects());
  };

  // Reset game
  const handleResetGame = () => {
    setGameState('idle');
    setTimeLeft(120);
    setScore(0);
    const newGrid: GridCell[][] = [];
    for (let i = 0; i < 5; i++) {
      const row: GridCell[] = [];
      for (let j = 0; j < 5; j++) {
        row.push({ row: i, col: j, object: null });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setAvailableObjects(generateObjects());
  };

  // Handle drag start
  const handleDragStart = useCallback((obj: typeof availableObjects[0]) => {
    if (gameState !== 'playing') return;
    setDraggedObject(obj);
  }, [gameState]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing') return;
    setHoveredCell({ row, col });
  }, [gameState]);

  // Handle drag leave
  const handleDragLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  // Handle drop
  const handleDrop = useCallback((row: number, col: number) => {
    if (!draggedObject || gameState !== 'playing') return;
    
    // Check if cell is already occupied
    if (grid[row][col].object) return;

    // Place object in grid
    const newGrid = [...grid];
    newGrid[row][col] = { row, col, object: draggedObject };
    setGrid(newGrid);

    // Update score
    setScore((prev) => prev + draggedObject.points);

    // Remove object from available objects
    setAvailableObjects((prev) => prev.filter((obj) => obj.uniqueId !== draggedObject.uniqueId));

    // Clear dragged object and hovered cell
    setDraggedObject(null);
    setHoveredCell(null);
  }, [draggedObject, grid, gameState]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border-4 border-green-300 p-6 mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Eco Placement Challenge
                </h1>
                <p className="text-sm text-gray-600">Drag & drop eco objects into the grid before time runs out!</p>
              </div>
            </div>

            {/* Timer and Score */}
            <div className="flex items-center gap-4">
              {/* Timer */}
              <Card className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300">
                <div className="flex items-center gap-2">
                  <Timer className={`h-5 w-5 ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`} />
                  <div>
                    <p className="text-xs text-blue-700">Time Left</p>
                    <p className={`text-2xl ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-900'}`}>
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Score */}
              <Card className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-300">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-xs text-yellow-700">Score</p>
                    <p className="text-2xl text-yellow-900">{score}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Grid Section */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border-4 border-green-300 p-8"
          >
            <h2 className="text-2xl text-center mb-6 text-green-700">
              🌍 Eco Grid (5×5)
            </h2>

            {/* 5x5 Grid */}
            <div className="flex items-center justify-center">
              <div className="inline-grid grid-cols-5 gap-3 p-4 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-2xl">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;
                    const hasObject = cell.object !== null;

                    return (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        whileHover={!hasObject && gameState === 'playing' ? { scale: 1.05 } : {}}
                        className={`
                          relative w-20 h-20 rounded-xl border-3 transition-all
                          ${hasObject 
                            ? 'border-green-400 bg-white shadow-lg' 
                            : isHovered && draggedObject
                            ? 'border-green-500 bg-green-100 border-dashed shadow-lg scale-105'
                            : 'border-gray-300 bg-white/50 border-dashed'
                          }
                          ${gameState === 'playing' && !hasObject ? 'cursor-pointer hover:border-green-400 hover:bg-green-50' : ''}
                        `}
                        onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                        onDragLeave={handleDragLeave}
                        onDrop={() => handleDrop(rowIndex, colIndex)}
                      >
                        {hasObject && cell.object && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-2"
                          >
                            <div className={`p-2 bg-gradient-to-br ${cell.object.color} rounded-lg mb-1`}>
                              <cell.object.icon className="h-6 w-6 text-white" />
                            </div>
                            <Badge 
                              variant={cell.object.points < 0 ? 'destructive' : 'default'}
                              className="text-xs"
                            >
                              {cell.object.points > 0 ? '+' : ''}{cell.object.points}
                            </Badge>
                          </motion.div>
                        )}

                        {isHovered && draggedObject && !hasObject && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <draggedObject.icon className="h-8 w-8 text-green-600" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Game Status Message */}
            <AnimatePresence mode="wait">
              {gameState === 'idle' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center mt-6 text-gray-600"
                >
                  Press "Start Game" to begin your eco adventure! 🌱
                </motion.p>
              )}
              {gameState === 'playing' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center mt-6 text-green-700"
                >
                  Drag objects from the panel and drop them into the grid! 🎯
                </motion.p>
              )}
              {gameState === 'ended' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center mt-6"
                >
                  <p className="text-2xl text-green-700 mb-2">🎉 Game Over!</p>
                  <p className="text-lg text-gray-700">Final Score: <span className="font-bold text-green-600">{score}</span> points</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Objects Panel */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border-4 border-blue-300 p-6"
          >
            <h2 className="text-xl text-center mb-4 text-blue-700">
              🎨 Eco Objects ({availableObjects.length})
            </h2>

            {/* Objects Grid */}
            <div className="h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100">
              <div className="grid grid-cols-2 gap-3">
                {availableObjects.map((obj) => (
                  <motion.div
                    key={obj.uniqueId}
                    draggable={gameState === 'playing'}
                    onDragStart={() => handleDragStart(obj)}
                    whileHover={gameState === 'playing' ? { scale: 1.05, y: -2 } : {}}
                    className={`
                      ${gameState === 'playing' ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed opacity-50'}
                      transition-all
                    `}
                  >
                    <Card className={`
                      p-4 bg-gradient-to-br ${obj.color} border-2 border-white shadow-lg
                      ${gameState === 'playing' ? 'hover:shadow-2xl' : ''}
                    `}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white/90 rounded-xl">
                          <obj.icon className="h-8 w-8 text-gray-700" />
                        </div>
                        <p className="text-xs text-white text-center">{obj.name}</p>
                        <Badge 
                          variant={obj.points < 0 ? 'destructive' : 'secondary'}
                          className="bg-white text-gray-900"
                        >
                          {obj.points > 0 ? '+' : ''}{obj.points} pts
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl">
              <p className="text-xs text-gray-700 text-center">
                💡 <strong>Tip:</strong> Trees & Recycling give max points! Avoid cars! 🚗
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border-4 border-green-300 p-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            {gameState === 'idle' && (
              <Button
                size="lg"
                onClick={handleStartGame}
                className="px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Game
              </Button>
            )}

            {gameState === 'playing' && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleResetGame}
                className="px-8 py-6 text-lg rounded-2xl border-2 border-red-400 text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset Game
              </Button>
            )}

            {gameState === 'ended' && (
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleResetGame}
                  className="px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-lg"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Play Again
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-2xl border-2 border-green-400"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  Submit Score
                </Button>
              </div>
            )}
          </div>

          {/* Instructions */}
          {gameState === 'idle' && (
            <div className="mt-6 text-center">
              <h3 className="text-lg text-gray-700 mb-2">How to Play:</h3>
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
                  <p className="text-4xl mb-2">⏱️</p>
                  <p className="text-sm text-gray-700">You have 2 minutes to place as many eco objects as possible</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
                  <p className="text-4xl mb-2">🎯</p>
                  <p className="text-sm text-gray-700">Drag objects from the panel and drop them into the 5×5 grid</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl">
                  <p className="text-4xl mb-2">🏆</p>
                  <p className="text-sm text-gray-700">Earn points based on object values. High score wins!</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
