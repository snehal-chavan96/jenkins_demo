import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, Menu, User, X, Sparkles, Moon, Sun, Bell, Icon } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { MobileNav } from './MobileNav';
import {
  Home,
  BookOpen,
  Gamepad2,
  Trophy,
  ClipboardList,
  Users,
  BarChart3,
  Megaphone
} from 'lucide-react';
import { AnimatePresence, motion as motion2 } from 'framer-motion';
import SplashCursor from '../SplashCursor';


export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');

    } catch (error) {
      console.error('Logout failed:', error);
    }

  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);



  const navLinks = isAuthenticated
    ? user?.role === 'teacher'
      ? [
        { path: '/teacher-dashboard', label: 'Dashboard', icon: Home },
        // { path: '/class-list', label: 'Students', icon: Users },
        // { path: '/student-list', label: 'Students', icon: Users },
        { path: '/epic-submissions', label: 'Epic Challenge Submissions', icon: ClipboardList },
        // { path: '/course-management', label: 'Courses', icon: BookOpen },
        { path: '/quiz-management', label: 'Quizzes', icon: ClipboardList },
        // { path: '/announcements', label: 'Announcements', icon: Megaphone },

      ]
      : user?.role === 'institution'
        ? [
          { path: '/institution-dashboard', label: 'Dashboard', icon: Home },
          // { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
        ]
        : [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/courses', label: 'Courses', icon: BookOpen },
          { path: '/challenges', label: 'Games', icon: Gamepad2 },
          { path: '/quizzes', label: 'Quizzes', icon: ClipboardList },
          { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
          // { path: '/rewards', label: 'Rewards', emoji: '🎁' },
        ]
    : [];

  return (

    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="sticky top-0 z-50 w-full glass-card-strong border-b-4 border-[#3FB984] dark:border-[#3FB984]/50 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mouse follower effect */}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute w-32 h-32 rounded-full bg-[#3FB984]/20 dark:bg-[#3FB984]/30 blur-3xl"
          animate={{
            x: mousePosition.x - 64,
            y: mousePosition.y - 64,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200,
            mass: 0.5,
          }}
        />
      )}

      {/* <SplashCursor/> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3FB984] via-[#2d8a5f] to-[#22c55e] shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="h-8 w-8 text-white" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-5 w-5 text-[#FFD166]" fill="currentColor" />
              </motion.div>
            </motion.div>
            <div>
              <span className="block bg-gradient-to-r from-[#3FB984] via-[#2d8a5f] to-[#22c55e] bg-clip-text text-2xl text-transparent">
                EcoLearn
              </span>
              <span className="block text-xs text-[#3FB984]">Save the Planet! 🌍</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link key={link.path} to={link.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-2xl transition-all flex items-center gap-3 ${location.pathname === link.path
                      ? 'bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] text-white shadow-lg'
                      : 'hover:bg-[#3FB984]/10'
                      }`}
                  >
                    <motion.div
                      whileHover={{ rotate: 8 }}
                      className="h-9 w-9 flex items-center justify-center rounded-xl 
               bg-gradient-to-br from-[#3FB984]/20 to-[#22c55e]/20
               border border-[#3FB984]/30 shadow-sm"
                    >
                      <div className="h-9 w-9 flex items-center justify-center rounded-xl 
                  bg-white/20 text-[#22c55e]">
                        <Icon className="h-5 w-5" />
                      </div>

                    </motion.div>
                    <span>{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}

          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle - Always visible */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl glass-card hover:shadow-lg transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-[#FFD166]" />
              ) : (
                <Moon className="h-5 w-5 text-[#3069F0]" />
              )}
            </motion.button>

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                {/* <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="hidden sm:flex relative h-10 w-10 items-center justify-center rounded-xl glass-card hover:shadow-lg transition-all"
                >
                  <Bell className="h-5 w-5 text-[#3069F0]" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    3
                  </Badge>
                </motion.button> */}

                {/* Eco Points Display */}
                {user.ecoPoints !== undefined && (
                  <motion.div
                    className="hidden sm:flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3FB984]/20 to-[#2d8a5f]/20 dark:from-[#3FB984]/30 dark:to-[#2d8a5f]/30 px-5 py-2.5 shadow-sm border-2 border-[#3FB984]/30 dark:border-[#3FB984]/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Leaf className="h-5 w-5 text-[#3FB984]" />
                    </motion.div>
                    <span className="text-[#3FB984] font-semibold">{user.ecoPoints}</span>
                  </motion.div>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Avatar className="h-12 w-12 border-3 border-[#3FB984] shadow-md cursor-pointer">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-[#3FB984] to-[#2d8a5f] text-white">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl border-2 border-[#3FB984]/30 dark:border-[#3FB984]/50 glass-card">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-muted-foreground text-sm">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        if (user?.role === "teacher") {
                          navigate("/teacher-profile");
                        } else {
                          navigate("/profile"); // student
                        }
                      }}
                      className="rounded-lg cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button - Only show when authenticated */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="md:hidden flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#3FB984]/20 to-[#2d8a5f]/20 hover:from-[#3FB984]/30 hover:to-[#2d8a5f]/30 transition-colors shadow-md border-2 border-[#3FB984]/30"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-[#3FB984]" />
                  ) : (
                    <Menu className="h-6 w-6 text-[#3FB984]" />
                  )}
                </motion.button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="rounded-xl hover:bg-[#3FB984]/10 dark:hover:bg-[#3FB984]/20"
                >
                  Login
                </Button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="rounded-xl bg-gradient-to-r from-[#3FB984] via-[#2d8a5f] to-[#22c55e] hover:from-[#2d8a5f] hover:via-[#3FB984] hover:to-[#2d8a5f] shadow-lg"
                    onClick={() => navigate('/register')}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Started
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </motion.nav>
  );
};