// src/components/landing/FeaturesSection.tsx
import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../components/ui/card';
import { BookOpen, Target, Trophy, Users } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Fun Lessons',
    description: 'Learn about nature with cool videos, games, and quizzes!',
    color: 'from-blue-400 to-blue-600',
    emoji: '📚',
  },
  {
    icon: Target,
    title: 'Epic Challenges',
    description: 'Complete missions to save the planet and earn rewards!',
    color: 'from-orange-400 to-orange-600',
    emoji: '🎯',
  },
  {
    icon: Trophy,
    title: 'Win Prizes',
    description: 'Collect eco-points, badges, and climb to the top!',
    color: 'from-yellow-400 to-yellow-600',
    emoji: '🏆',
  },
  {
    icon: Users,
    title: 'Play EcoGames',
    description: 'Learn while you play fun, interactive eco-themed games.',
    color: 'from-green-400 to-green-600',
    emoji: '🎮',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-4xl sm:text-5xl bg-gradient-to-r from-[#3FB984] to-[#3069F0] bg-clip-text text-transparent">
              What Makes EcoLearn Super Awesome? 🚀
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto">
              Get ready for the most fun way to learn about saving our amazing planet!
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <Card className="h-full hover:shadow-2xl transition-shadow border-2 border-[#3FB984]/30 rounded-2xl overflow-hidden glass-card">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className={`mb-4 mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${feature.color} shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-10 w-10 text-white" />
                  </motion.div>
                  <div className="text-4xl mb-3">{feature.emoji}</div>
                  <h3 className="mb-3 text-xl text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
