import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Sparkles, Trophy, Leaf, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { GlassCard } from '../../components/gamification/GlassCard';
import { toast } from 'sonner';

type Player = 'tree' | 'pollution' | null;
type GameState = 'playing' | 'win' | 'lose' | 'tie';

const ECO_TIPS = [
  "🌳 Planting trees reduces carbon footprint",
  "🌍 Small actions create big environmental change",
  "💚 One tree can absorb 48 pounds of CO2 per year",
  "🌱 Trees provide oxygen for 2 people annually",
  "🌿 Protecting nature protects our future",
  "🍃 Every tree planted is a gift to the planet",
];

export const EcoTicTacToe = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [currentTip, setCurrentTip] = useState(ECO_TIPS[0]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  // Rotate eco tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(ECO_TIPS[Math.floor(Math.random() * ECO_TIPS.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check for winner
  const checkWinner = (currentBoard: Player[]): { winner: Player; line: number[] | null } => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6], // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: pattern };
      }
    }

    // Check for tie - only if board is full
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: null, line: null };
    }

    // Game still in progress
    return { winner: null, line: null };
  };

  // AI Move
  const makeAIMove = (currentBoard: Player[]): number => {
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'pollution';
        const { winner } = checkWinner(testBoard);
        if (winner === 'pollution') return i;
      }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'tree';
        const { winner } = checkWinner(testBoard);
        if (winner === 'tree') return i;
      }
    }

    // Take center if available
    if (currentBoard[4] === null) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => currentBoard[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const availableSpaces = currentBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  };

  // Handle player move
  const handleCellClick = (index: number) => {
    if (board[index] !== null || gameState !== 'playing' || isAIThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'tree';
    setBoard(newBoard);

    // Check if player won
    const { winner, line } = checkWinner(newBoard);
    
    if (winner === 'tree') {
      setGameState('win');
      setWinLine(line);
      const points = 30;
      setEcoPoints(prev => prev + points);
      setWins(prev => prev + 1);
      setGamesPlayed(prev => prev + 1);
      setPointsEarned(points);
      setTimeout(() => setShowResultModal(true), 600);
      toast.success('Great job! You helped the environment grow 🌱', {
        description: `+${points} Eco Points earned!`,
      });
      return;
    }

    // Check for tie (board full, no winner)
    if (winner === null && newBoard.every(cell => cell !== null)) {
      setGameState('tie');
      const points = 10;
      setEcoPoints(prev => prev + points);
      setGamesPlayed(prev => prev + 1);
      setPointsEarned(points);
      setTimeout(() => setShowResultModal(true), 600);
      toast.info('Balanced outcome. Every action matters!', {
        description: `+${points} Eco Points earned!`,
      });
      return;
    }

    // AI's turn
    setIsAIThinking(true);
    setTimeout(() => {
      const aiMove = makeAIMove(newBoard);
      const aiBoard = [...newBoard];
      aiBoard[aiMove] = 'pollution';
      setBoard(aiBoard);
      setIsAIThinking(false);

      // Check if AI won
      const { winner: aiWinner, line: aiLine } = checkWinner(aiBoard);
      if (aiWinner === 'pollution') {
        setGameState('lose');
        setWinLine(aiLine);
        setGamesPlayed(prev => prev + 1);
        setPointsEarned(0);
        setTimeout(() => setShowResultModal(true), 600);
        toast.error('Pollution won this time. Try again to save nature!');
      } else if (aiWinner === null && aiBoard.every(cell => cell !== null)) {
        // Tie after AI move
        setGameState('tie');
        const points = 10;
        setEcoPoints(prev => prev + points);
        setGamesPlayed(prev => prev + 1);
        setPointsEarned(points);
        setTimeout(() => setShowResultModal(true), 600);
        toast.info('Balanced outcome. Every action matters!', {
          description: `+${points} Eco Points earned!`,
        });
      }
    }, 800);
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameState('playing');
    setWinLine(null);
    setIsAIThinking(false);
    setShowResultModal(false);
    setPointsEarned(0);
    setHoveredCell(null);
  };

  // Get cell content
  const getCellContent = (cell: Player) => {
    if (cell === 'tree') return '🌳';
    if (cell === 'pollution') return '🏭';
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300 p-4 sm:p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Button
            onClick={() => navigate('/challenges')}
            variant="ghost"
            className="mb-4 hover:bg-green-100 dark:hover:bg-green-900/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>

          <div className="text-center space-y-3 sm:space-y-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block text-5xl sm:text-6xl mb-2"
            >
              🌳
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#3FB984] via-green-600 to-emerald-700 bg-clip-text text-transparent">
              Eco Tic-Tac-Toe
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              Plant trees and protect the environment from pollution!
            </p>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <GlassCard gradient="from-green-100/60 to-green-200/60" borderColor="border-green-300" hover={false}>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-1">🌿</div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Eco Points</p>
              <motion.p
                className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400"
                key={ecoPoints}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {ecoPoints}
              </motion.p>
            </CardContent>
          </GlassCard>

          <GlassCard gradient="from-blue-100/60 to-blue-200/60" borderColor="border-blue-300" hover={false}>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-1">🎮</div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Games Played</p>
              <motion.p 
                className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400"
                key={gamesPlayed}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {gamesPlayed}
              </motion.p>
            </CardContent>
          </GlassCard>

          <GlassCard gradient="from-yellow-100/60 to-yellow-200/60" borderColor="border-yellow-300" hover={false}>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-1">🏆</div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Wins</p>
              <motion.p 
                className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                key={wins}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                {wins}
              </motion.p>
            </CardContent>
          </GlassCard>

          <GlassCard gradient="from-purple-100/60 to-purple-200/60" borderColor="border-purple-300" hover={false}>
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl mb-1">⚡</div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0}%
              </p>
            </CardContent>
          </GlassCard>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <GlassCard gradient="from-white/60 to-white/40" borderColor="border-green-200" hover={false}>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* Turn Indicator */}
                <div className="mb-4 sm:mb-6 text-center min-h-[60px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {isAIThinking ? (
                      <motion.div
                        key="ai-turn"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-4 sm:px-6 py-3 rounded-2xl border-2 border-gray-300 dark:border-gray-600"
                      >
                        <div className="text-3xl sm:text-4xl">🏭</div>
                        <p className="text-lg sm:text-2xl font-bold text-gray-700 dark:text-gray-300">
                          Pollution Spreading...
                        </p>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-gray-400 border-t-transparent rounded-full"
                        />
                      </motion.div>
                    ) : gameState === 'playing' ? (
                      <motion.div
                        key="player-turn"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 px-4 sm:px-6 py-3 rounded-2xl border-2 border-green-400 dark:border-green-600"
                      >
                        <div className="text-3xl sm:text-4xl">🌳</div>
                        <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                          Your Turn: Plant a Tree
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="game-over"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xl sm:text-2xl font-bold text-gray-500 dark:text-gray-400"
                      >
                        Game Complete!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tic-Tac-Toe Grid */}
                <div className="relative max-w-md mx-auto">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {board.map((cell, index) => {
                      const isWinningCell = winLine?.includes(index);
                      const isEmpty = cell === null;
                      const canInteract = isEmpty && gameState === 'playing' && !isAIThinking;
                      
                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleCellClick(index)}
                          onMouseEnter={() => canInteract && setHoveredCell(index)}
                          onMouseLeave={() => setHoveredCell(null)}
                          disabled={!canInteract}
                          whileHover={canInteract ? { scale: 1.05, y: -2 } : {}}
                          whileTap={canInteract ? { scale: 0.95 } : {}}
                          className={`
                            aspect-square rounded-xl sm:rounded-2xl text-4xl sm:text-5xl lg:text-6xl flex items-center justify-center
                            transition-all duration-300 border-3 sm:border-4 relative overflow-hidden
                            ${isEmpty ? 'bg-gradient-to-br from-green-50/80 to-blue-50/80 dark:from-gray-800/80 dark:to-gray-700/80 border-green-200 dark:border-gray-600' : ''}
                            ${isEmpty && hoveredCell === index && canInteract ? 'border-green-400 dark:border-green-500 bg-gradient-to-br from-green-100/90 to-emerald-100/90 dark:from-green-900/60 dark:to-emerald-800/60 shadow-lg' : ''}
                            ${cell === 'tree' ? 'bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 border-green-400 dark:border-green-600' : ''}
                            ${cell === 'pollution' ? 'bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-600 border-gray-400 dark:border-gray-500' : ''}
                            ${isWinningCell ? 'ring-4 ring-yellow-400 dark:ring-yellow-500 shadow-2xl' : 'shadow-md'}
                            ${canInteract ? 'cursor-pointer' : 'cursor-not-allowed'}
                            ${isAIThinking && isEmpty ? 'opacity-50' : ''}
                          `}
                        >
                          <AnimatePresence>
                            {cell && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ 
                                  scale: 1, 
                                  rotate: 0,
                                  ...(isWinningCell ? { 
                                    y: [0, -8, 0],
                                    rotate: [0, 5, -5, 0]
                                  } : {})
                                }}
                                transition={{ 
                                  type: 'spring', 
                                  stiffness: 260, 
                                  damping: 20,
                                  ...(isWinningCell ? { 
                                    y: { repeat: Infinity, duration: 0.8 },
                                    rotate: { repeat: Infinity, duration: 1.5 }
                                  } : {})
                                }}
                              >
                                {getCellContent(cell)}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Eco pattern for empty cells */}
                          {isEmpty && (
                            <motion.div 
                              className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl pointer-events-none"
                              animate={{ 
                                opacity: hoveredCell === index && canInteract ? 0.3 : 0.1,
                                scale: hoveredCell === index && canInteract ? 1.2 : 1
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              🍃
                            </motion.div>
                          )}
                          
                          {/* Hover preview */}
                          {isEmpty && hoveredCell === index && canInteract && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 0.4, scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl lg:text-6xl"
                            >
                              🌳
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* How to Play */}
            <GlassCard gradient="from-blue-100/60 to-blue-200/60" borderColor="border-blue-300" hover={false}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="text-3xl sm:text-4xl">📖</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">How to Play</h3>
                </div>
                <div className="space-y-2 sm:space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">🌳</span>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">You are Trees</p>
                      <p className="text-xs sm:text-sm">Plant trees to protect nature</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">🏭</span>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">AI is Pollution</p>
                      <p className="text-xs sm:text-sm">Stop pollution from spreading</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">🎯</span>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Win Condition</p>
                      <p className="text-xs sm:text-sm">Get 3 in a row to win!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            {/* Eco Tip */}
            <GlassCard gradient="from-green-100/60 to-emerald-200/60" borderColor="border-green-300" hover={false}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl sm:text-4xl"
                  >
                    💡
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Eco Tip</h3>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentTip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-base sm:text-lg text-gray-700 dark:text-gray-300"
                  >
                    {currentTip}
                  </motion.p>
                </AnimatePresence>
              </CardContent>
            </GlassCard>

            {/* Player Legend */}
            <GlassCard gradient="from-purple-100/60 to-pink-200/60" borderColor="border-purple-300" hover={false}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="text-3xl sm:text-4xl">⚔️</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Players</h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 dark:bg-green-900/30 rounded-xl border-2 border-green-300 dark:border-green-700">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-4xl">🌳</span>
                      <div>
                        <p className="font-bold text-sm sm:text-base text-green-700 dark:text-green-300">Trees</p>
                        <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">You</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs sm:text-sm">
                      Player
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-300 dark:border-gray-600">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-4xl">🏭</span>
                      <div>
                        <p className="font-bold text-sm sm:text-base text-gray-700 dark:text-gray-300">Pollution</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Computer</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xs sm:text-sm">
                      AI
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            {/* Rewards */}
            <GlassCard gradient="from-yellow-100/60 to-orange-200/60" borderColor="border-yellow-300" hover={false}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl sm:text-4xl"
                  >
                    🏆
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Rewards</h3>
                </div>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span className="flex items-center gap-2 text-sm sm:text-base">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      Win
                    </span>
                    <span className="font-bold text-green-600 text-sm sm:text-base">+30 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <span className="flex items-center gap-2 text-sm sm:text-base">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Tie
                    </span>
                    <span className="font-bold text-blue-600 text-sm sm:text-base">+10 Points</span>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </div>

        {/* Result Modal */}
        <AnimatePresence>
          {showResultModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowResultModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <GlassCard gradient="from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-800/90" borderColor="border-green-300" hover={false}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="text-center space-y-4 sm:space-y-6">
                      {gameState === 'win' && (
                        <>
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              rotate: { duration: 0.5, repeat: Infinity },
                              scale: { duration: 0.8, repeat: Infinity }
                            }}
                            className="text-7xl sm:text-8xl"
                          >
                            🌱
                          </motion.div>
                          <div className="bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 rounded-2xl p-6 border-2 border-green-400 dark:border-green-600">
                            <h2 className="text-3xl sm:text-4xl font-bold text-green-700 dark:text-green-300 mb-3">
                              Great job! 🎉
                            </h2>
                            <p className="text-lg sm:text-xl text-green-600 dark:text-green-400 mb-4">
                              You helped the environment grow!
                            </p>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: 'spring' }}
                            >
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg sm:text-xl px-6 py-2">
                                <Leaf className="w-5 h-5 mr-2" />
                                +{pointsEarned} Eco Points
                              </Badge>
                            </motion.div>
                          </div>
                        </>
                      )}

                      {gameState === 'lose' && (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-7xl sm:text-8xl"
                          >
                            😔
                          </motion.div>
                          <div className="bg-gradient-to-r from-orange-100 to-red-200 dark:from-orange-900/50 dark:to-red-800/50 rounded-2xl p-6 border-2 border-orange-400 dark:border-orange-600">
                            <h2 className="text-3xl sm:text-4xl font-bold text-orange-700 dark:text-orange-300 mb-3">
                              Pollution won this time
                            </h2>
                            <p className="text-lg sm:text-xl text-orange-600 dark:text-orange-400">
                              Try again to save nature!
                            </p>
                          </div>
                        </>
                      )}

                      {gameState === 'tie' && (
                        <>
                          <motion.div
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-7xl sm:text-8xl"
                          >
                            🤝
                          </motion.div>
                          <div className="bg-gradient-to-r from-blue-100 to-purple-200 dark:from-blue-900/50 dark:to-purple-800/50 rounded-2xl p-6 border-2 border-blue-400 dark:border-blue-600">
                            <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-3">
                              Balanced outcome
                            </h2>
                            <p className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 mb-4">
                              Every action matters!
                            </p>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: 'spring' }}
                            >
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg sm:text-xl px-6 py-2">
                                <Leaf className="w-5 h-5 mr-2" />
                                +{pointsEarned} Eco Points
                              </Badge>
                            </motion.div>
                          </div>
                        </>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <Button
                          onClick={resetGame}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-base sm:text-lg px-6 py-5 sm:py-6 rounded-xl shadow-lg"
                        >
                          <RotateCcw className="w-5 h-5 mr-2" />
                          Play Again
                        </Button>
                        <Button
                          onClick={() => navigate('/challenges')}
                          variant="outline"
                          className="border-2 border-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 text-base sm:text-lg px-6 py-5 sm:py-6 rounded-xl"
                        >
                          Back to Games
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
