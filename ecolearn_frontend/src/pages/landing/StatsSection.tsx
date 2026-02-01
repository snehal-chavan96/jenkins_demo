// src/components/landing/StatsSection.tsx
import React from 'react';
import { motion } from 'motion/react';

const stats = [
  { value: '10,000+', label: 'Happy Students', emoji: '😊' },
  { value: '500+', label: 'Schools', emoji: '🏫' },
  { value: '1M+', label: 'Eco-Points', emoji: '🌿' },
  { value: '50,000+', label: 'Trees Planted', emoji: '🌳' },
];

export const StatsSection = () => {
  return (
    <section className="bg-background dark:bg-gray-800 transition-colors duration-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center p-6 glass-card rounded-2xl border-2 border-[#3FB984]/30 shadow-md"
            >
              <div className="text-5xl mb-3">{stat.emoji}</div>
              <div className="mb-2 text-3xl bg-gradient-to-r from-[#3FB984] to-[#3069F0] bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
