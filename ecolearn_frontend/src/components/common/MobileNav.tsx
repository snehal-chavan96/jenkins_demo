import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Home, BookOpen, Target, Trophy, Award, User, BarChart3, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, emoji: '🏠' },
    { path: '/courses', label: 'Courses', icon: BookOpen, emoji: '📚' },
    { path: '/challenges', label: 'Games', icon: Target, emoji: '🎮' },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy, emoji: '🏆' },
    { path: '/rewards', label: 'Rewards', icon: Award, emoji: '🎁' },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, emoji: '📊' },
    { path: '/profile', label: 'Profile', icon: User, emoji: '👤' },
  ];

  const teacherLinks = [
    { path: '/teacher-dashboard', label: 'Dashboard', icon: Home, emoji: '🏠' },
    { path: '/courses', label: 'Courses', icon: BookOpen, emoji: '📚' },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy, emoji: '🏆' },
    { path: '/analytics', label: 'Analytics', icon: BarChart3, emoji: '📊' },
    { path: '/profile', label: 'Profile', icon: User, emoji: '👤' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 glass-card-strong shadow-2xl z-50 md:hidden overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="text-3xl">🌱</div>
                  <span className="text-2xl bg-gradient-to-r from-[#3FB984] to-[#3069F0] bg-clip-text text-transparent">
                    EcoLearn
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full glass-card hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <X className="h-5 w-5 text-foreground" />
                </motion.button>
              </div>

              {/* User Info */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6 p-4 glass-card rounded-2xl shadow-md border-2 border-[#3FB984]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3FB984] to-[#2d8a5f] text-white text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                      {user.role === 'student' && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-[#3FB984]">🌿 {user.ecoPoints} pts</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-[#3069F0]">⭐ Level {user.level}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-2">
                {links.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] text-white shadow-lg'
                            : 'glass-card hover:bg-accent text-foreground'
                        }`}
                      >
                        <span className="text-2xl">{link.emoji}</span>
                        <span className="text-sm">{link.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeMobile"
                            className="ml-auto h-2 w-2 rounded-full bg-white"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl glass-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-5 w-5 text-[#FFD166]" />
                        <span className="text-sm">Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 text-[#3069F0]" />
                        <span className="text-sm">Dark Mode</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.div>

              {/* Logout Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 pt-6 border-t-2 border-border"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm">Logout</span>
                </motion.button>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 text-center"
              >
                <p className="text-xs text-muted-foreground">
                  EcoLearn v2.0
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Save the planet, one lesson at a time 🌍
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};