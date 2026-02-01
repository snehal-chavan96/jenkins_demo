import { motion } from 'motion/react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  color?: string;
  label?: string;
  className?: string;
}

export const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  children,
  color = 'from-green-400 to-emerald-600',
  label,
  className = '',
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress Circle with Gradient */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`bg-gradient-to-r ${color}`}
            stroke="url(#progressGradient)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children || (
            <motion.div
              className="text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl text-gray-900 dark:text-white">{Math.round(progress)}%</span>
            </motion.div>
          )}
        </div>

        {/* Glowing Effect */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${color} opacity-20 blur-xl`}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Label */}
      {label && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">{label}</p>
      )}
    </div>
  );
};
