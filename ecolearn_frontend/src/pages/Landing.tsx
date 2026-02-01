import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Leaf, Target, Trophy, Users, Sparkles, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const Landing = () => {
  const navigate = useNavigate();

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
      title: 'Make Friends',
      description: 'Team up with other eco-heroes from around the world!',
      color: 'from-green-400 to-green-600',
      emoji: '👥',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Students', emoji: '😊' },
    { value: '500+', label: 'Schools', emoji: '🏫' },
    { value: '1M+', label: 'Eco-Points', emoji: '🌿' },
    { value: '50,000+', label: 'Trees Planted', emoji: '🌳' },
  ];

  const FloatingIcon = ({ children, delay }: { children: React.ReactNode; delay: number }) => (
    <motion.div
      className="absolute"
      initial={{ y: 0 }}
      animate={{ y: [-20, 20, -20] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 px-4 py-16 sm:px-6 lg:px-8">
        {/* Floating decorative elements */}
        <FloatingIcon delay={0}>
          <div className="absolute top-20 left-10 text-6xl opacity-20">🌱</div>
        </FloatingIcon>
        <FloatingIcon delay={1}>
          <div className="absolute top-40 right-20 text-5xl opacity-20">🦋</div>
        </FloatingIcon>
        <FloatingIcon delay={2}>
          <div className="absolute bottom-40 left-1/4 text-4xl opacity-20">☀️</div>
        </FloatingIcon>
        <FloatingIcon delay={1.5}>
          <div className="absolute top-60 right-1/3 text-5xl opacity-20">🌍</div>
        </FloatingIcon>

        <div className="container mx-auto relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 glass-card rounded-full shadow-lg border-2 border-[#3FB984]/30"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="h-5 w-5 text-[#FFD166]" fill="currentColor" />
                <span className="text-[#3FB984]">Join the Green Heroes!</span>
                <Star className="h-5 w-5 text-[#FFD166]" fill="currentColor" />
              </motion.div>

              <h1 className="mb-6 text-5xl sm:text-6xl bg-gradient-to-r from-[#3FB984] via-[#3069F0] to-[#2d8a5f] bg-clip-text text-transparent">
                Save Our Planet, One Lesson at a Time! 🌍
              </h1>
              <p className="mb-8 text-xl text-foreground leading-relaxed">
                Hey there, future eco-warrior! 👋 Ready to learn cool things about nature, 
                complete awesome challenges, and become a real-life planet hero? Let's go! 🚀
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="text-lg rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-xl border-4 border-green-300"
                    onClick={() => navigate('/register')}
                  >
                    <Sparkles className="mr-2 h-6 w-6" />
                    Start Your Adventure!
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg rounded-2xl border-4 border-green-400 hover:bg-green-50"
                    onClick={() => navigate('/login')}
                  >
                    I Already Have an Account
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1612542454336-cee36a54c6d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGxlYXJuaW5nJTIwbmF0dXJlfGVufDF8fHx8MTc2MTU4Nzc3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Children Learning Nature"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
              </div>
              
              {/* Floating Award Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl hidden lg:block border-4 border-yellow-300"
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Award className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <div className="text-2xl text-gray-900">2,850</div>
                    <div className="text-gray-600">Eco-Points Earned!</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Features Section */}
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

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 py-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🌳</div>
          <div className="absolute bottom-10 right-10 text-8xl">🌻</div>
          <div className="absolute top-1/2 left-1/4 text-6xl">☀️</div>
          <div className="absolute top-1/3 right-1/4 text-7xl">🦋</div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="h-8 w-8 text-yellow-300" fill="currentColor" />
              <Heart className="h-8 w-8 text-yellow-300" fill="currentColor" />
              <Heart className="h-8 w-8 text-yellow-300" fill="currentColor" />
            </motion.div>
            <h2 className="mb-6 text-white text-4xl sm:text-5xl">
              Ready to Become an Eco-Hero? 🦸
            </h2>
            <p className="mb-8 text-green-50 max-w-2xl mx-auto text-xl leading-relaxed">
              Join thousands of kids just like you who are learning how to protect our beautiful planet! 
              It's free, it's fun, and you'll make a real difference! 🌟
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  size="lg"
                  className="text-lg rounded-2xl bg-white text-green-600 hover:bg-green-50 shadow-2xl border-4 border-yellow-300"
                  onClick={() => navigate('/register')}
                >
                  <Sparkles className="mr-2 h-6 w-6" />
                  Join the Adventure Now!
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
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
    </div>
  );
};