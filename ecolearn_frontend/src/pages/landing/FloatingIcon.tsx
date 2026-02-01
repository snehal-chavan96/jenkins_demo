// src/components/landing/FloatingIcon.tsx
import { motion } from 'motion/react';
import React from 'react';

interface FloatingIconProps {
  children: React.ReactNode;
  delay: number;
  className?: string;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({ children, delay, className }) => (
  <motion.div
    className={className}
    initial={{ y: 0 }}
    animate={{ y: [-20, 20, -20] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);
