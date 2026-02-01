import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Timer, 
  Droplets, 
  Trophy, 
  Star,
  Shuffle,
  Play,
  ArrowRight,
  RotateCw,
  Volume2,
  VolumeX,
  Zap,
  Target,
  CheckCircle2,
  AlertTriangle,
  Home,
  X,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { cn } from '../../components/ui/utils';

// Pipe types - Complete set
type PipeType = 
  | 'straight-h'      // Horizontal (→ ←)
  | 'straight-v'      // Vertical (↑ ↓)
  | 'curve-tr'        // Top-Right
  | 'curve-rb'        // Right-Bottom
  | 'curve-bl'        // Bottom-Left
  | 'curve-lt'        // Left-Top
  | 't-junction'      // 3-way junction
  | 'cross'           // 4-way junction
  | 'end-cap'         // Closed end (dead-end)
  | 'broken'          // Broken pipe (leaks)
  | 'start'           // Start point
  | 'end';            // End point (tank inlet)

interface PipeTile {
  id: string;
  type: PipeType;
  rotation: number;
  isConnected: boolean;
  hasWater: boolean;
  isLeaking: boolean;
  row: number;
  col: number;
}

interface Level {
  level: number;
  gridSize: number;
  timeLimit: number;
  basePoints: number;
  title: string;
  description: string;
}

const LEVELS: Level[] = [
  { 
    level: 1, 
    gridSize: 5, 
    timeLimit: 120, 
    basePoints: 100, 
    title: 'Beginner Plumber', 
    description: 'Fix the Water Pipes (5×5 Grid)'
  },
  { 
    level: 2, 
    gridSize: 6, 
    timeLimit: 120, 
    basePoints: 200, 
    title: 'Advanced Pipeline', 
    description: 'Connect the Complex System (6×6 Grid)'
  },
  { 
    level: 3, 
    gridSize: 7, 
    timeLimit: 120, 
    basePoints: 500, 
    title: 'Master Plumber', 
    description: 'Ultimate Challenge (7×7 Grid)'
  },
];

const WATER_FACTS = [
  "A single dripping tap can waste over 5,000 liters of water per year! 💧",
  "Fixing leaks in your home can save up to 10% on your water bill! 💰",
  "Clean water is essential for life - over 2 billion people lack access to safe water! 🌍",
  "Agriculture uses about 70% of the world's freshwater supply! 🌾",
  "By 2025, half of the world's population may face water shortages! ⚠️",
  "The average person uses about 150 liters of water per day! 🚿",
  "It takes 2,700 liters of water to make one cotton T-shirt! 👕"
];

type GameScreen = 'menu' | 'playing' | 'paused';

export const WaterConservation = () => {
  const navigate = useNavigate();
  
  // Screen state
  const [gameScreen, setGameScreen] = useState<GameScreen>('menu');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  
  // Game state
  const [grid, setGrid] = useState<PipeTile[][]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [waterLeaked, setWaterLeaked] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [failureReason, setFailureReason] = useState('');
  
  // Drag and drop state
  const [draggedTile, setDraggedTile] = useState<{row: number, col: number} | null>(null);
  const [hoveredTile, setHoveredTile] = useState<{row: number, col: number} | null>(null);
  
  // Interaction mode
  const [interactionMode, setInteractionMode] = useState<'drag' | 'rotate'>('drag');
  
  const currentLevel = selectedLevel !== null ? LEVELS[selectedLevel - 1] : null;
  
  // Timer
  useEffect(() => {
    if (gameScreen === 'playing' && !isPuzzleComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameFailed('Time ran out! Pipeline incomplete.');
            return 0;
          }
          return prev - 1;
        });
        setTimeTaken(prev => prev + 1);
        
        // Water leakage increases over time
        setWaterLeaked(prev => Math.min(100, prev + 0.3));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameScreen, isPuzzleComplete, timeLeft]);
  
  // Check for leaks periodically
  useEffect(() => {
    if (gameScreen === 'playing' && !isPuzzleComplete) {
      const leakChecker = setInterval(() => {
        checkForLeaks();
      }, 2000);
      return () => clearInterval(leakChecker);
    }
  }, [gameScreen, isPuzzleComplete, grid]);
  
  const initializeGrid = (levelIndex: number) => {
    const level = LEVELS[levelIndex - 1];
    const size = level.gridSize;
    const newGrid: PipeTile[][] = [];
    
    // Create grid with random pipe configurations
    const pipeTypes: PipeType[] = [
      'straight-h', 'straight-v', 
      'curve-tr', 'curve-rb', 'curve-bl', 'curve-lt',
      't-junction', 'cross'
    ];
    
    let tileId = 0;
    for (let row = 0; row < size; row++) {
      const gridRow: PipeTile[] = [];
      for (let col = 0; col < size; col++) {
        // Add some broken pipes randomly (10% chance)
        const isBroken = Math.random() < 0.1;
        const randomType = isBroken ? 'broken' : pipeTypes[Math.floor(Math.random() * pipeTypes.length)];
        
        gridRow.push({
          id: `tile-${tileId++}`,
          type: randomType,
          rotation: Math.floor(Math.random() * 4) * 90,
          isConnected: false,
          hasWater: false,
          isLeaking: false,
          row,
          col
        });
      }
      newGrid.push(gridRow);
    }
    
    // Set start point (top-left corner)
    newGrid[0][0] = {
      id: 'start-tile',
      type: 'start',
      rotation: 0,
      isConnected: true,
      hasWater: true,
      isLeaking: false,
      row: 0,
      col: 0
    };
    
    // Set end point (bottom-right corner - tank inlet)
    newGrid[size - 1][size - 1] = {
      id: 'end-tile',
      type: 'end',
      rotation: 0,
      isConnected: false,
      hasWater: false,
      isLeaking: false,
      row: size - 1,
      col: size - 1
    };
    
    setGrid(newGrid);
    setTimeLeft(level.timeLimit);
    setWaterLeaked(0);
    setWaterLevel(0);
    setMovesCount(0);
    setTimeTaken(0);
    setIsPuzzleComplete(false);
    setScore(0);
  };
  
  const startGame = (levelIndex: number) => {
    setSelectedLevel(levelIndex);
    initializeGrid(levelIndex);
    setGameScreen('playing');
  };
  
  const shuffleGrid = () => {
    const size = currentLevel!.gridSize;
    const newGrid = grid.map((row, rowIdx) => 
      row.map((tile, colIdx) => {
        // Don't shuffle start and end points
        if (tile.type === 'start' || tile.type === 'end') {
          return tile;
        }
        
        return {
          ...tile,
          rotation: Math.floor(Math.random() * 4) * 90,
          isConnected: false,
          hasWater: false,
          isLeaking: false,
        };
      })
    );
    
    // Reset start point connection
    newGrid[0][0].isConnected = true;
    newGrid[0][0].hasWater = true;
    
    setGrid(newGrid);
    setMovesCount(0);
  };
  
  const handleTileClick = (row: number, col: number) => {
    if (isPuzzleComplete) return;
    
    const tile = grid[row][col];
    
    // In rotate mode, rotate the tile
    if (interactionMode === 'rotate') {
      if (tile.type === 'start' || tile.type === 'end') return;
      
      const newGrid = [...grid];
      newGrid[row][col] = {
        ...tile,
        rotation: (tile.rotation + 90) % 360,
      };
      
      setGrid(newGrid);
      setMovesCount(prev => prev + 1);
      
      setTimeout(() => checkConnections(), 100);
    }
  };
  
  const handleDragStart = (row: number, col: number) => {
    if (interactionMode !== 'drag') return;
    if (isPuzzleComplete) return;
    
    const tile = grid[row][col];
    if (tile.type === 'start' || tile.type === 'end') return;
    
    setDraggedTile({ row, col });
  };
  
  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    setHoveredTile({ row, col });
  };
  
  const handleDrop = (row: number, col: number) => {
    if (!draggedTile || isPuzzleComplete) return;
    
    const targetTile = grid[row][col];
    if (targetTile.type === 'start' || targetTile.type === 'end') {
      setDraggedTile(null);
      setHoveredTile(null);
      return;
    }
    
    // Swap tiles
    const newGrid = [...grid];
    const temp = newGrid[row][col];
    newGrid[row][col] = newGrid[draggedTile.row][draggedTile.col];
    newGrid[draggedTile.row][draggedTile.col] = temp;
    
    // Update positions
    newGrid[row][col].row = row;
    newGrid[row][col].col = col;
    newGrid[draggedTile.row][draggedTile.col].row = draggedTile.row;
    newGrid[draggedTile.row][draggedTile.col].col = draggedTile.col;
    
    setGrid(newGrid);
    setMovesCount(prev => prev + 1);
    setDraggedTile(null);
    setHoveredTile(null);
    
    setTimeout(() => checkConnections(), 100);
  };
  
  const checkConnections = () => {
    const size = currentLevel!.gridSize;
    const newGrid = [...grid];
    
    // Reset all connections
    newGrid.forEach(row => row.forEach(tile => {
      tile.isConnected = false;
      tile.hasWater = false;
      tile.isLeaking = false;
    }));
    
    // BFS from start position
    const queue: {row: number, col: number}[] = [{row: 0, col: 0}];
    const visited = new Set<string>();
    newGrid[0][0].isConnected = true;
    newGrid[0][0].hasWater = true;
    
    while (queue.length > 0) {
      const {row, col} = queue.shift()!;
      const key = `${row}-${col}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      const tile = newGrid[row][col];
      
      // Check for broken pipes
      if (tile.type === 'broken') {
        tile.isLeaking = true;
        continue; // Water stops at broken pipe
      }
      
      const connections = getTileConnections(tile);
      
      connections.forEach(dir => {
        let nextRow = row;
        let nextCol = col;
        
        if (dir === 'up') nextRow--;
        else if (dir === 'down') nextRow++;
        else if (dir === 'left') nextCol--;
        else if (dir === 'right') nextCol++;
        
        if (nextRow >= 0 && nextRow < size && nextCol >= 0 && nextCol < size) {
          const nextTile = newGrid[nextRow][nextCol];
          const oppositeDir = dir === 'up' ? 'down' : dir === 'down' ? 'up' : dir === 'left' ? 'right' : 'left';
          const nextConnections = getTileConnections(nextTile);
          
          if (nextConnections.includes(oppositeDir) && !visited.has(`${nextRow}-${nextCol}`)) {
            nextTile.isConnected = true;
            nextTile.hasWater = true;
            queue.push({row: nextRow, col: nextCol});
          }
        }
      });
    }
    
    setGrid(newGrid);
    
    // Update water level based on connections
    const connectedCount = newGrid.flat().filter(t => t.isConnected).length;
    const totalTiles = size * size;
    setWaterLevel((connectedCount / totalTiles) * 100);
    
    // Check if puzzle is complete (end tile is connected)
    if (newGrid[size - 1][size - 1].isConnected && newGrid[size - 1][size - 1].hasWater) {
      completePuzzle();
    }
  };
  
  const getTileConnections = (tile: PipeTile): string[] => {
    const baseConnections: Record<PipeType, string[]> = {
      'straight-h': ['left', 'right'],
      'straight-v': ['up', 'down'],
      'curve-tr': ['up', 'right'],
      'curve-rb': ['right', 'down'],
      'curve-bl': ['down', 'left'],
      'curve-lt': ['left', 'up'],
      't-junction': ['up', 'left', 'right'],
      'cross': ['up', 'down', 'left', 'right'],
      'end-cap': [],
      'broken': ['up', 'down', 'left', 'right'], // Leaks in all directions
      'start': ['right', 'down'], // Can flow right or down
      'end': ['up', 'left'], // Can receive from up or left
    };
    
    const connections = baseConnections[tile.type] || [];
    const rotations = tile.rotation / 90;
    
    // Rotate connections
    return connections.map(dir => {
      const dirs = ['up', 'right', 'down', 'left'];
      const index = dirs.indexOf(dir);
      return dirs[(index + rotations) % 4];
    });
  };
  
  const checkForLeaks = () => {
    if (isPuzzleComplete) return;
    
    const leakingTiles = grid.flat().filter(t => t.isLeaking);
    
    if (leakingTiles.length > 0) {
      handleGameFailed('Water is leaking from broken pipes!');
    }
    
    // Check for open ends (pipes with water that aren't connected properly)
    const waterTiles = grid.flat().filter(t => t.hasWater);
    for (const tile of waterTiles) {
      const connections = getTileConnections(tile);
      const size = currentLevel!.gridSize;
      
      for (const dir of connections) {
        let nextRow = tile.row;
        let nextCol = tile.col;
        
        if (dir === 'up') nextRow--;
        else if (dir === 'down') nextRow++;
        else if (dir === 'left') nextCol--;
        else if (dir === 'right') nextCol++;
        
        // Check if connection leads out of bounds or to empty tile
        if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) {
          // Open end leading nowhere
          if (tile.type !== 'start' && tile.type !== 'end') {
            tile.isLeaking = true;
          }
        }
      }
    }
  };
  
  const completePuzzle = () => {
    setIsPuzzleComplete(true);
    setGameScreen('paused');
    
    // Calculate score based on time
    let finalScore = currentLevel!.basePoints;
    
    if (timeTaken <= 60) {
      // Completed under 1 minute - full points
      finalScore = currentLevel!.basePoints;
    } else {
      // Reduce 2 points per extra second
      const extraSeconds = timeTaken - 60;
      finalScore = Math.max(0, currentLevel!.basePoints - (extraSeconds * 2));
    }
    
    setScore(finalScore);
    setWaterLevel(100);
    
    setTimeout(() => setShowCompletion(true), 500);
  };
  
  const handleGameFailed = (reason: string) => {
    setGameScreen('paused');
    setFailureReason(reason);
    setTimeout(() => setShowFailure(true), 500);
  };
  
  const restartLevel = () => {
    setShowCompletion(false);
    setShowFailure(false);
    if (selectedLevel) {
      initializeGrid(selectedLevel);
      setGameScreen('playing');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 p-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block mb-6">
              <Button
                variant="outline"
                onClick={() => navigate('/challenges')}
                className="rounded-xl border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
              <div className="text-7xl mb-4">💧</div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Water Conservation Challenge
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Pipe Fixing Challenge – Save water by connecting the pipeline to the tank!
              </p>
            </motion.div>
          </div>
          
          {/* How to Play */}
          <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800 rounded-3xl shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-600" />
                How to Play
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Select Interaction Mode</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Choose between <strong>Drag & Drop</strong> (swap tiles) or <strong>Rotate</strong> (click to rotate)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">2</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Connect the Pipeline</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Create a continuous path from 🚰 <strong>start</strong> to 🎯 <strong>tank inlet</strong>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">3</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Avoid Water Waste</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Watch out for <strong>broken pipes</strong> 💥 and avoid creating <strong>leaks</strong>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">4</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Beat the Clock</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Complete under <strong>1 minute</strong> for maximum points!
                      </p>
                    </div>
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
                <Card className="border-4 border-blue-200 dark:border-blue-800 rounded-3xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-3xl transition-all bg-white dark:bg-gray-800">
                  <CardContent className="p-0">
                    {/* Level Badge */}
                    <div className={cn(
                      "p-6 text-center relative",
                      level.level === 1 && "bg-gradient-to-br from-green-400 to-emerald-500",
                      level.level === 2 && "bg-gradient-to-br from-blue-400 to-cyan-500",
                      level.level === 3 && "bg-gradient-to-br from-purple-400 to-pink-500"
                    )}>
                      <div className="text-6xl mb-2">
                        {level.level === 1 && '🌱'}
                        {level.level === 2 && '💪'}
                        {level.level === 3 && '👑'}
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
                          <span className="text-gray-600 dark:text-gray-400">Grid Size</span>
                          <Badge variant="outline">{level.gridSize}×{level.gridSize}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Time Limit</span>
                          <Badge variant="outline">{level.timeLimit}s</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Max Points</span>
                          <Badge className="bg-yellow-500 text-white">{level.basePoints}</Badge>
                        </div>
                      </div>
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => startGame(level.level)}
                          className={cn(
                            "w-full rounded-xl text-white shadow-lg",
                            level.level === 1 && "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                            level.level === 2 && "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700",
                            level.level === 3 && "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                          )}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Play Level {level.level}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900">
      {/* Top Game Bar */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b-4 border-blue-300 dark:border-blue-800 shadow-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={backToMenu}
                  className="rounded-xl border-2 border-blue-300 dark:border-blue-700"
                  size="sm"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Menu
                </Button>
              </motion.div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  💧 {currentLevel?.title}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Level {selectedLevel} - {currentLevel?.gridSize}×{currentLevel?.gridSize}</p>
              </div>
            </div>
            
            {/* Center: Timer & Leak */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/60 dark:to-cyan-900/60 px-4 py-2 rounded-xl border-2 border-blue-300 dark:border-blue-700">
                <Timer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Time</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/60 dark:to-orange-900/60 px-4 py-2 rounded-xl border-2 border-red-300 dark:border-red-700">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Droplets className="h-5 w-5 text-red-600 dark:text-red-400" />
                </motion.div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Leaked</div>
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {waterLeaked.toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Score & Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/60 dark:to-orange-900/60 px-4 py-2 rounded-xl border-2 border-yellow-300 dark:border-yellow-700">
                <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{score}</div>
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
          
          {/* Water Leak Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Water Conservation Status</span>
              <span>{(100 - waterLeaked).toFixed(0)}% Safe</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                initial={{ width: '100%' }}
                animate={{ width: `${100 - waterLeaked}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Game Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Puzzle Grid */}
          <div className="lg:col-span-2">
            <Card className="border-4 border-blue-300 dark:border-blue-800 rounded-3xl shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-800/95">
              <CardContent className="p-6">
                {/* Control Panel */}
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        Pipe Puzzle Grid
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Moves: {movesCount} | Connect 🚰 to 🎯
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={cn(
                          "cursor-pointer transition-all",
                          interactionMode === 'drag' 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        )}
                        onClick={() => setInteractionMode('drag')}
                      >
                        🔄 Drag & Drop
                      </Badge>
                      <Badge 
                        className={cn(
                          "cursor-pointer transition-all",
                          interactionMode === 'rotate' 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        )}
                        onClick={() => setInteractionMode('rotate')}
                      >
                        🔃 Rotate
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        onClick={shuffleGrid}
                        variant="outline"
                        className="w-full rounded-xl border-2 border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        disabled={isPuzzleComplete}
                      >
                        <Shuffle className="mr-2 h-4 w-4" />
                        Shuffle
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        onClick={restartLevel}
                        variant="outline"
                        className="w-full rounded-xl border-2 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Restart
                      </Button>
                    </motion.div>
                  </div>
                </div>
                
                {/* Puzzle Grid */}
                <div className="flex justify-center">
                  <div 
                    className="inline-grid gap-2 p-6 bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 dark:from-gray-700 dark:to-blue-900 rounded-2xl shadow-inner"
                    style={{
                      gridTemplateColumns: `repeat(${currentLevel?.gridSize}, minmax(0, 1fr))`,
                    }}
                  >
                    {grid.map((row, rowIndex) => 
                      row.map((tile, colIndex) => (
                        <motion.div
                          key={tile.id}
                          draggable={interactionMode === 'drag' && tile.type !== 'start' && tile.type !== 'end' && !isPuzzleComplete}
                          onDragStart={() => handleDragStart(rowIndex, colIndex)}
                          onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
                          onDrop={() => handleDrop(rowIndex, colIndex)}
                          onClick={() => handleTileClick(rowIndex, colIndex)}
                          whileHover={{ 
                            scale: (!isPuzzleComplete && tile.type !== 'start' && tile.type !== 'end') ? 1.1 : 1 
                          }}
                          whileTap={{ 
                            scale: (!isPuzzleComplete && tile.type !== 'start' && tile.type !== 'end') ? 0.95 : 1 
                          }}
                          className={cn(
                            'relative w-14 h-14 rounded-xl transition-all duration-300 cursor-pointer',
                            'shadow-lg hover:shadow-2xl border-3',
                            tile.isConnected && !tile.isLeaking
                              ? 'bg-gradient-to-br from-blue-400 to-cyan-500 border-blue-600 dark:border-blue-400' 
                              : tile.isLeaking
                              ? 'bg-gradient-to-br from-red-400 to-orange-500 border-red-600 dark:border-red-400'
                              : 'bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500',
                            draggedTile?.row === rowIndex && draggedTile?.col === colIndex && 'opacity-50 scale-95',
                            hoveredTile?.row === rowIndex && hoveredTile?.col === colIndex && 'ring-4 ring-yellow-400',
                            (tile.type === 'start' || tile.type === 'end') && 'cursor-default'
                          )}
                          style={{
                            transform: `rotate(${tile.rotation}deg)`,
                          }}
                        >
                          {/* Pipe Shape */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <PipeShape type={tile.type} hasWater={tile.hasWater} isLeaking={tile.isLeaking} />
                          </div>
                          
                          {/* Water Flow Animation */}
                          {tile.hasWater && !tile.isLeaking && (
                            <motion.div
                              className="absolute inset-0 rounded-xl"
                              animate={{
                                boxShadow: [
                                  '0 0 0 0 rgba(59, 130, 246, 0.6)',
                                  '0 0 0 10px rgba(59, 130, 246, 0)',
                                ],
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                          
                          {/* Leak Animation */}
                          {tile.isLeaking && (
                            <motion.div
                              className="absolute inset-0 rounded-xl"
                              animate={{
                                boxShadow: [
                                  '0 0 0 0 rgba(239, 68, 68, 0.6)',
                                  '0 0 0 10px rgba(239, 68, 68, 0)',
                                ],
                              }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          )}
                          
                          {/* Special Tile Indicators */}
                          {tile.type === 'start' && (
                            <div className="absolute -top-2 -right-2 text-2xl">🚰</div>
                          )}
                          {tile.type === 'end' && (
                            <div className="absolute -top-2 -right-2 text-2xl">🎯</div>
                          )}
                          {tile.type === 'broken' && (
                            <div className="absolute -top-2 -right-2 text-2xl">💥</div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Pipe Type Legend */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Pipe Types
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">─</div>
                      <span>Straight</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">┐</div>
                      <span>Curve</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">┬</div>
                      <span>T-Junction</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">┼</div>
                      <span>Cross</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">●</div>
                      <span>End Cap</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 bg-red-400 rounded flex items-center justify-center">💥</div>
                      <span>Broken</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center shadow-lg">●</div>
                      <span>Connected</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 bg-white dark:bg-gray-600 rounded border-2">●</div>
                      <span>Not Connected</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right: Water Tank & Stats */}
          <div className="space-y-6">
            {/* Water Tank */}
            <Card className="border-4 border-cyan-200 dark:border-cyan-800 rounded-3xl shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-800/95">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <Target className="h-5 w-5 text-cyan-600" />
                  Water Tank Goal
                </h3>
                
                <div className="relative h-72 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl border-4 border-gray-400 dark:border-gray-500 overflow-hidden shadow-inner">
                  {/* Water Level */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400"
                    animate={{ height: `${waterLevel}%` }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Wave Effect */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-6 bg-cyan-300"
                      animate={{
                        x: [0, 30, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        clipPath: 'polygon(0 50%, 10% 30%, 20% 50%, 30% 30%, 40% 50%, 50% 30%, 60% 50%, 70% 30%, 80% 50%, 90% 30%, 100% 50%, 100% 100%, 0 100%)'
                      }}
                    />
                  </motion.div>
                  
                  {/* Tank Display */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-10">
                    <div className="text-7xl mb-2">
                      {waterLevel === 100 ? '💧' : waterLevel > 50 ? '💦' : waterLevel > 0 ? '💧' : '🚰'}
                    </div>
                    <div className="text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {waterLevel.toFixed(0)}%
                    </div>
                    <div className="text-sm font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1">
                      {waterLevel === 100 ? 'TANK FULL!' : 'Filling...'}
                    </div>
                  </div>
                  
                  {/* Level Markers */}
                  {[25, 50, 75].map(mark => (
                    <div
                      key={mark}
                      className="absolute left-0 right-0 border-t-2 border-dashed border-gray-500 dark:border-gray-400"
                      style={{ bottom: `${mark}%` }}
                    >
                      <span className="absolute -left-10 -top-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                        {mark}%
                      </span>
                    </div>
                  ))}
                </div>
                
                <p className="text-center mt-4 text-sm font-semibold">
                  {isPuzzleComplete ? (
                    <span className="text-green-600 dark:text-green-400">✅ Pipeline Connected!</span>
                  ) : waterLevel > 0 ? (
                    <span className="text-blue-600 dark:text-blue-400">💧 Water Flowing...</span>
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">🔧 Connect pipes to fill tank</span>
                  )}
                </p>
              </CardContent>
            </Card>
            
            {/* Progress Stats */}
            <Card className="border-2 border-green-200 dark:border-green-800 rounded-2xl shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-green-900/20">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Game Progress
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Connected Pipes</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {grid.flat().filter(t => t.isConnected).length} / {currentLevel?.gridSize! * currentLevel?.gridSize!}
                      </span>
                    </div>
                    <Progress 
                      value={(grid.flat().filter(t => t.isConnected).length / (currentLevel?.gridSize! * currentLevel?.gridSize!)) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">Time Remaining</span>
                      <span className={cn(
                        "font-bold",
                        timeLeft > 60 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
                      )}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <Progress 
                      value={(timeLeft / currentLevel?.timeLimit!) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-green-200 dark:border-green-800">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{movesCount}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Moves</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {grid.flat().filter(t => t.isLeaking).length}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Leaks</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Instructions Card */}
            <Card className="border-2 border-purple-200 dark:border-purple-800 rounded-2xl shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  💡 Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                    <span><strong>Blue glow</strong> = pipe has water flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                    <span><strong>Red glow</strong> = water is leaking!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                    <span>Avoid <strong>💥 broken pipes</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">•</span>
                    <span>Under 1 min = <strong>Max points!</strong></span>
                  </li>
                </ul>
              </CardContent>
            </Card>
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
              className="bg-gradient-to-br from-green-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border-4 border-green-300 dark:border-green-700"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-center mb-6"
              >
                <div className="text-9xl mb-4">🎉</div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 dark:from-green-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                  Pipe Fixed!
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">Water is flowing perfectly! 💧</p>
              </motion.div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-green-200 dark:border-green-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      Time Taken
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <RotateCw className="h-5 w-5" />
                      Total Moves
                    </span>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {movesCount}
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                        Points Earned
                      </span>
                      <span className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                        {score}
                      </span>
                    </div>
                  </div>
                </div>
                
                {timeTaken <= 60 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-4 border-2 border-yellow-300 dark:border-yellow-700"
                  >
                    <div className="flex items-center gap-2 text-yellow-900 dark:text-yellow-300 justify-center">
                      <Star className="h-6 w-6 fill-yellow-500" />
                      <span className="font-bold text-lg">⚡ SPEED BONUS! Completed under 1 minute!</span>
                    </div>
                  </motion.div>
                )}
                
                <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl p-4 border-2 border-cyan-300 dark:border-cyan-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-5 w-5 text-cyan-600" />
                    <span className="font-semibold text-cyan-900 dark:text-cyan-300">💡 Water Conservation Fact</span>
                  </div>
                  <p className="text-sm text-cyan-800 dark:text-cyan-200 leading-relaxed">
                    {WATER_FACTS[Math.floor(Math.random() * WATER_FACTS.length)]}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
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
                    className="w-full rounded-xl bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-lg py-6"
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
                  <div className="text-8xl mb-4">⚠️</div>
                </motion.div>
                <h2 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Water Wasted!
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                  {failureReason}
                </p>
              </div>
              
              <div className="bg-red-100 dark:bg-red-900/20 rounded-2xl p-6 mb-6 border-2 border-red-200 dark:border-red-800">
                <div className="space-y-3 text-center">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time Used</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Moves Made</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{movesCount}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 mb-6 border-2 border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-900 dark:text-orange-200 text-center">
                  💡 <strong>Tip:</strong> Check for broken pipes (💥) and make sure all pipe ends connect properly!
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
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Try Again
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Pipe Shape SVG Component
const PipeShape = ({ type, hasWater, isLeaking }: { type: PipeType; hasWater: boolean; isLeaking: boolean }) => {
  const color = isLeaking ? '#ef4444' : hasWater ? '#3b82f6' : '#9ca3af';
  const strokeWidth = 5;
  
  if (type === 'straight-h') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <line x1="0" y1="28" x2="56" y2="28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    );
  }
  
  if (type === 'straight-v') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <line x1="28" y1="0" x2="28" y2="56" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    );
  }
  
  if (type === 'curve-tr') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <path d="M 28 0 L 28 28 L 56 28" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  if (type === 'curve-rb') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <path d="M 56 28 L 28 28 L 28 56" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  if (type === 'curve-bl') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <path d="M 28 56 L 28 28 L 0 28" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  if (type === 'curve-lt') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <path d="M 0 28 L 28 28 L 28 0" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  
  if (type === 't-junction') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <line x1="28" y1="0" x2="28" y2="28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <line x1="0" y1="28" x2="56" y2="28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    );
  }
  
  if (type === 'cross') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <line x1="0" y1="28" x2="56" y2="28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <line x1="28" y1="0" x2="28" y2="56" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    );
  }
  
  if (type === 'end-cap') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="8" fill={color} />
      </svg>
    );
  }
  
  if (type === 'broken') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <line x1="10" y1="28" x2="20" y2="28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <line x1="36" y1="28" x2="46" y2="28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <text x="28" y="32" fontSize="16" textAnchor="middle" fill={color}>✕</text>
      </svg>
    );
  }
  
  if (type === 'start') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="12" fill={color} stroke={color} strokeWidth="2" />
        <line x1="28" y1="28" x2="56" y2="28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    );
  }
  
  if (type === 'end') {
    return (
      <svg width="100%" height="100%" viewBox="0 0 56 56">
        <rect x="38" y="18" width="18" height="20" fill={color} stroke={color} strokeWidth="2" rx="2" />
        <line x1="0" y1="28" x2="38" y2="28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    );
  }
  
  return null;
};
