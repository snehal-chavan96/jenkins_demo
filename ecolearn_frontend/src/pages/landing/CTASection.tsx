// src/components/landing/CTASection.tsx
import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 py-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-8xl">🌳</div>
        <div className="absolute bottom-10 right-10 text-8xl">🌻</div>
        <div className="absolute top-1/2 left-1/4 text-6xl">☀️</div>
        <div className="absolute top-1/3 right-1/4 text-7xl">🦋</div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <motion.div className="inline-flex items-center gap-2 mb-6" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Heart className="h-8 w-8 text-yellow-300" fill="currentColor" />
            <Heart className="h-8 w-8 text-yellow-300" fill="currentColor" />
            <Heart className="h-8 w-8 text-yellow-300" fill="currentColor" />
          </motion.div>

          <h2 className="mb-6 text-white text-4xl sm:text-5xl">Ready to Become an Eco-Hero? 🦸</h2>
          <p className="mb-8 text-green-50 max-w-2xl mx-auto text-xl leading-relaxed">
            Join thousands of kids just like you who are learning how to protect our beautiful planet! 
            It's free, it's fun, and you'll make a real difference! 🌟
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                className="text-lg rounded-2xl bg-white text-green-600 hover:bg-green-50 shadow-2xl border-4 border-yellow-300"
                onClick={() => navigate('/register')}
              >
                <Sparkles className="mr-2 h-6 w-6" /> Join the Adventure Now!
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg rounded-2xl border-4 border-white text-white hover:bg-white/20 shadow-xl"
                onClick={() => navigate('/courses')}
              >
                Explore Cool Lessons
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
