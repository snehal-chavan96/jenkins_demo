import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Trophy, Sparkles, Lock, Target, Zap, Wind } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { GlassCard } from '../../components/gamification/GlassCard';
import { toast } from 'sonner';

type BubbleType = 'temperature' | 'coal' | 'pollution';
type PowerBallType = 'tree' | 'solar' | 'cleanair';

interface Bubble {
  id: string;
  type: BubbleType;
  x: number;
  y: number;
  radius: number;
  speed: number;
}

interface Level {
  level: number;
  bubbleRadius: number;
  speed: number;
  ecoPoints: number;
  unlocked: boolean;
}

const BUBBLE_CONFIG = {
  temperature: {
    color: 'from-red-500 to-orange-500',
    label: 'Temperature Rise',
    icon: '🌡️',
    textColor: 'text-gray-900 dark:text-white'
  },
  coal: {
    color: 'from-gray-900 to-gray-700',
    label: 'Coal',
    icon: '⚫',
    textColor: 'text-white'
  },
  pollution: {
    color: 'from-gray-500 to-blue-300',
    label: 'Air Pollution',
    icon: '💨',
    textColor: 'text-white'
  },
};

const POWERBALL_CONFIG = {
  tree: {
    color: 'from-[#3FB984] to-green-600',
    icon: '🌳',
    label: 'Tree Power',
    affects: 'temperature' as BubbleType
  },
  solar: {
    color: 'from-[#FFD166] to-yellow-600',
    icon: '☀️',
    label: 'Solar Power',
    affects: 'coal' as BubbleType
  },
  cleanair: {
    color: 'from-blue-400 to-cyan-500',
    icon: '💨',
    label: 'Clean Air',
    affects: 'pollution' as BubbleType
  },
};

const LEVELS: Level[] = [
  { level: 1, bubbleRadius: 20, speed: 0.03, ecoPoints: 100, unlocked: true },
  { level: 2, bubbleRadius: 30, speed: 0.1, ecoPoints: 200, unlocked: false },
  { level: 3, bubbleRadius: 40, speed: 0.2, ecoPoints: 300, unlocked: false },
];

export const BubbleShooter = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'levelComplete' | 'gameOver'>('menu');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levels, setLevels] = useState<Level[]>(LEVELS);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [selectedPowerBall, setSelectedPowerBall] = useState<PowerBallType>('tree');
  const [ecoPoints, setEcoPoints] = useState(0);
  const [totalEcoPoints, setTotalEcoPoints] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cannonAngle, setCannonAngle] = useState(0);
  const [shooting, setShooting] = useState(false);
  const [projectiles, setProjectiles] = useState<Array<{ id: string; x: number; y: number; angle: number; type: PowerBallType }>>([]);
  const animationFrameRef = useRef<number>();
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 950 });

  useEffect(() => {
    const updateCanvasSize = () => {
      const width = Math.min(window.innerWidth - 100, 900);
      const height = Math.min(window.innerHeight - 200, 950); // 25cm ≈ 950px
      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Start level
  const startLevel = (levelNum: number) => {
    const level = levels.find(l => l.level === levelNum);
    if (!level || !level.unlocked) return;

    setCurrentLevel(levelNum);
    setGameState('playing');
    setEcoPoints(0);

    // Spawn bubbles
    const bubbleTypes: BubbleType[] = ['temperature', 'coal', 'pollution'];
    const initialBubbles: Bubble[] = [];

    // Level 1: 1 bubble
    // Level 2: 2 bubbles
    // Level 3: 3 bubbles
    const bubbleCount = levelNum;

    for (let i = 0; i < bubbleCount; i++) {
      initialBubbles.push({
        id: `bubble-${Date.now()}-${i}`,
        type: bubbleTypes[i % bubbleTypes.length],
        x: (canvasSize.width / (bubbleCount + 1)) * (i + 1),
        y: level.bubbleRadius,
        radius: level.bubbleRadius,
        speed: level.speed,
      });
    }

    setBubbles(initialBubbles);
    setProjectiles([]);
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      // Update bubbles position
      setBubbles(prev => {
        const updated = prev.map(bubble => ({
          ...bubble,
          y: bubble.y + bubble.speed,
        }));

        // Check if any bubble reached the bottom
        const reachedBottom = updated.some(b => b.y + b.radius >= canvasSize.height - 100);
        if (reachedBottom) {
          setGameState('gameOver');
          toast.error('The planet is in danger! Try again!');
          return prev;
        }

        return updated;
      });

      // Update projectiles
      setProjectiles(prev => {
        return prev.map(proj => ({
          ...proj,
          x: proj.x + Math.sin(proj.angle) * 8,
          y: proj.y - Math.cos(proj.angle) * 8,
        })).filter(proj => {
          // Remove projectiles that are out of bounds
          return proj.x > 0 && proj.x < canvasSize.width && proj.y > 0;
        });
      });

      // Check collisions
      const projectilesToRemove = new Set<string>();

      setBubbles(prevBubbles => {
        let updatedBubbles = [...prevBubbles];

        projectiles.forEach(proj => {
          updatedBubbles = updatedBubbles.map(bubble => {
            const dx = proj.x - bubble.x;
            const dy = proj.y - bubble.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bubble.radius + 15 && !projectilesToRemove.has(proj.id)) {
              projectilesToRemove.add(proj.id);

              // Check if correct power ball type
              const correctType = POWERBALL_CONFIG[proj.type].affects === bubble.type;

              if (correctType) {
                const newRadius = bubble.radius - 10;

                if (newRadius <= 0) {
                  // Bubble destroyed
                  toast.success(`${BUBBLE_CONFIG[bubble.type].label} eliminated! +10 points`);
                  setEcoPoints(prev => prev + 10);
                  return null; // Remove bubble
                }

                return { ...bubble, radius: newRadius };
              } else {
                // Wrong power ball
                toast.error('Wrong power ball! No effect!');
                return bubble;
              }
            }

            return bubble;
          }).filter(Boolean) as Bubble[];
        });

        // Check if level complete
        if (updatedBubbles.length === 0 && prevBubbles.length > 0) {
          const level = levels.find(l => l.level === currentLevel);
          if (level) {
            setTotalEcoPoints(prev => prev + level.ecoPoints);
            setGameState('levelComplete');

            // Unlock next level
            setLevels(prev => prev.map(l =>
              l.level === currentLevel + 1 ? { ...l, unlocked: true } : l
            ));

            toast.success(`Level ${currentLevel} Complete! +${level.ecoPoints} Eco Points!`);
          }
        }

        return updatedBubbles;
      });

      // Remove projectiles that hit bubbles
      setProjectiles(prev => prev.filter(proj => !projectilesToRemove.has(proj.id)));

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, currentLevel, canvasSize, projectiles, levels]);

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });

    // Calculate cannon angle
    const cannonX = canvasSize.width / 2;
    const cannonY = canvasSize.height - 80;
    const angle = Math.atan2(x - cannonX, cannonY - y);
    setCannonAngle(angle);
  };

  // Shoot projectile
  const handleShoot = () => {
    if (gameState !== 'playing' || shooting) return;

    setShooting(true);

    const cannonX = canvasSize.width / 2;
    const cannonY = canvasSize.height - 80;

    setProjectiles(prev => [
      ...prev,
      {
        id: `proj-${Date.now()}`,
        x: cannonX,
        y: cannonY,
        angle: cannonAngle,
        type: selectedPowerBall,
      }
    ]);

    setTimeout(() => setShooting(false), 200);
  };

  // Restart level
  const restartLevel = () => {
    startLevel(currentLevel);
  };

  // Back to menu
  const backToMenu = () => {
    setGameState('menu');
    setBubbles([]);
    setProjectiles([]);
  };

  if (gameState === 'menu') {
    return (
      <div className="
        min-h-screen p-6
        bg-[linear-gradient(180deg,#38bdf8_0%,#7dd3fc_25%,#fef3c7_45%,#bbf7d0_65%,#4ade80_100%)]
        dark:bg-[linear-gradient(180deg,#020617_0%,#020617_40%,#1e293b_65%,#022c22_100%)]
        ">




        <div className="container mx-auto max-w-6xl">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🎯
            </motion.div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#3FB984] via-[#3069F0] to-[#FFD166] bg-clip-text text-transparent">
              Eco Shoot
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Shoot eco-power balls to eliminate environmental threats! Match the right power to destroy bubbles.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <GlassCard className="text-center p-6">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-3xl font-bold">{totalEcoPoints}</div>
              <div className="text-sm text-muted-foreground">Total Eco Points</div>
            </GlassCard>
            <GlassCard className="text-center p-6">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-3xl font-bold">{levels.filter(l => l.unlocked).length}</div>
              <div className="text-sm text-muted-foreground">Levels Unlocked</div>
            </GlassCard>
            <GlassCard className="text-center p-6">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-3xl font-bold">{levels.filter((l, idx) => l.unlocked && idx < levels.length - 1).length}</div>
              <div className="text-sm text-muted-foreground">Levels Completed</div>
            </GlassCard>
          </div>

          {/* Level Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {levels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className={`p-8 text-center relative overflow-hidden ${!level.unlocked ? 'opacity-50' : 'hover:shadow-2xl cursor-pointer'
                  }`}
                  onClick={() => level.unlocked && startLevel(level.level)}
                >
                  {!level.unlocked && (
                    <div className="absolute inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-10">
                      <Lock className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  <div className="text-6xl mb-4">
                    {level.level === 1 && '🌱'}
                    {level.level === 2 && '🌳'}
                    {level.level === 3 && '🌲'}
                  </div>

                  <h3 className="text-3xl font-bold mb-2">Level {level.level}</h3>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Bubble Size:</span>
                      <span className="font-semibold">{level.bubbleRadius}px</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Speed:</span>
                      <span className="font-semibold">{level.speed}x</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reward:</span>
                      <span className="font-semibold text-[#FFD166]">+{level.ecoPoints} pts</span>
                    </div>
                  </div>

                  {level.unlocked && (
                    <Button
                      className="w-full bg-gradient-to-r from-[#3FB984] to-green-600 hover:from-[#2d8a5f] hover:to-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        startLevel(level.level);
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Play Level {level.level}
                    </Button>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* How to Play */}
          <GlassCard className="mt-12 p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">How to Play</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-bold mb-2">Aim & Shoot</h4>
                <p className="text-sm text-muted-foreground">Move your mouse to aim. Click to shoot power balls at falling bubbles.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🌳☀️💨</div>
                <h4 className="font-bold mb-2">Match Powers</h4>
                <p className="text-sm text-muted-foreground">Use Tree for Temperature, Solar for Coal, Clean Air for Pollution.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💥</div>
                <h4 className="font-bold mb-2">Destroy Bubbles</h4>
                <p className="text-sm text-muted-foreground">Each hit shrinks bubbles. Destroy all before they reach the bottom!</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (gameState === 'levelComplete') {
    const level = levels.find(l => l.level === currentLevel);
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-sky-200 via-green-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto max-w-2xl flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <GlassCard className="p-12 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🎉
              </motion.div>

              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#3FB984] to-[#FFD166] bg-clip-text text-transparent">
                Level {currentLevel} Complete!
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center gap-3 text-2xl">
                  <Trophy className="w-8 h-8 text-[#FFD166]" />
                  <span className="font-bold">+{level?.ecoPoints} Eco Points</span>
                </div>

                <p className="text-lg text-muted-foreground">
                  Amazing work! You've protected the planet from environmental threats!
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={backToMenu}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  Level Select
                </Button>

                {currentLevel < 3 && (
                  <Button
                    onClick={() => startLevel(currentLevel + 1)}
                    size="lg"
                    className="px-8 bg-gradient-to-r from-[#3FB984] to-green-600 hover:from-[#2d8a5f] hover:to-green-700"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Next Level
                  </Button>
                )}

                {currentLevel === 3 && (
                  <Button
                    onClick={() => startLevel(1)}
                    size="lg"
                    className="px-8 bg-gradient-to-r from-[#3FB984] to-green-600 hover:from-[#2d8a5f] hover:to-green-700"
                  >
                    Play Again
                  </Button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-sky-200 via-green-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto max-w-2xl flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <GlassCard className="p-12 text-center">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-8xl mb-6"
              >
                😞
              </motion.div>

              <h2 className="text-5xl font-bold mb-4 text-red-500">
                Level Failed
              </h2>

              <p className="text-lg text-muted-foreground mb-8">
                The environmental threats reached the planet! Try again and protect our world!
              </p>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={backToMenu}
                  variant="outline"
                  size="lg"
                  className="px-8"
                >
                  Level Select
                </Button>

                <Button
                  onClick={restartLevel}
                  size="lg"
                  className="px-8 bg-gradient-to-r from-[#3FB984] to-green-600 hover:from-[#2d8a5f] hover:to-green-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-sky-200 via-green-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-7xl">
        {/* Top HUD */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={backToMenu} variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-8">
            <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-[#3069F0] to-blue-600">
              Level {currentLevel}
            </Badge>

            <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-[#FFD166] to-yellow-600 text-gray-800">
              <Sparkles className="w-4 h-4 mr-2" />
              {ecoPoints} Points
            </Badge>
          </div>
        </div>


        {/* Game Area */}
        <div className="flex gap-6 justify-center items-start">
          {/* Power Ball Sidebar */}
          <GlassCard className="w-64 p-4 sticky top-24">
            <h3 className="text-lg font-bold text-center mb-4">
              ⚡ Power Balls
            </h3>

            <div className="flex flex-col gap-4">
              {(Object.keys(POWERBALL_CONFIG) as PowerBallType[]).map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setSelectedPowerBall(type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <GlassCard
                    className={`p-4 transition-all ${selectedPowerBall === type
                      ? 'ring-4 ring-[#3FB984] shadow-2xl'
                      : 'opacity-70 hover:shadow-xl'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${POWERBALL_CONFIG[type].color}
              flex items-center justify-center text-2xl border-2 border-white`}
                      >
                        {POWERBALL_CONFIG[type].icon}
                      </div>

                      <div className="text-left">
                        <div className="font-bold text-sm">
                          {POWERBALL_CONFIG[type].label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          VS {BUBBLE_CONFIG[POWERBALL_CONFIG[type].affects].label}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-0 overflow-hidden">
            <div
              ref={canvasRef}
              className="relative bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 cursor-crosshair"
              style={{ width: canvasSize.width, height: canvasSize.height }}
              onMouseMove={handleMouseMove}
              onClick={handleShoot}
            >
              {/* Bubbles */}
              <AnimatePresence>
                {bubbles.map((bubble) => (
                  <motion.div
                    key={bubble.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`absolute rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 bg-gradient-to-br ${BUBBLE_CONFIG[bubble.type].color}`}
                    style={{
                      left: bubble.x - bubble.radius,
                      top: bubble.y - bubble.radius,
                      width: bubble.radius * 2,
                      height: bubble.radius * 2,
                    }}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{BUBBLE_CONFIG[bubble.type].icon}</div>
                      <div className={`text-xs font-bold ${BUBBLE_CONFIG[bubble.type].textColor} px-2`}>
                        {BUBBLE_CONFIG[bubble.type].label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Projectiles */}
              <AnimatePresence>
                {projectiles.map((proj) => (
                  <motion.div
                    key={proj.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute w-8 h-8 rounded-full bg-gradient-to-br ${POWERBALL_CONFIG[proj.type].color} shadow-lg flex items-center justify-center text-lg border-2 border-white`}
                    style={{
                      left: proj.x - 16,
                      top: proj.y - 16,
                    }}
                  >
                    {POWERBALL_CONFIG[proj.type].icon}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Aiming line */}
              {gameState === 'playing' && (
                <div
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 origin-bottom"
                  style={{
                    width: '3px',
                    height: '100px',
                    background: 'linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent)',
                    transform: `translateX(-50%) rotate(${cannonAngle}rad)`,
                    transformOrigin: 'bottom center',
                  }}
                />
              )}

              {/* Cannon */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                <motion.div
                  animate={{ rotate: shooting ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-2xl flex items-center justify-center border-4 border-gray-600">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-6 h-12 bg-gradient-to-t from-gray-700 to-gray-900 rounded-t-lg"
                    style={{
                      transform: `translateX(-50%) translateY(-100%) rotate(${cannonAngle}rad)`,
                      transformOrigin: 'bottom center',
                    }}
                  />
                </motion.div>
              </div>

              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-green-700 to-green-500 dark:from-green-900 dark:to-green-700" />
            </div>
          </GlassCard>
        </div>

        {/* Power Ball Selection */}

        {/* Instructions */}
        <GlassCard className="mt-6 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold">🎯 Aim with your mouse</span> • <span className="font-bold">🖱️ Click to shoot</span> • <span className="font-bold">⚡ Match power balls to bubble types</span>
          </p>
        </GlassCard>
      </div>
    </div>
  );
};