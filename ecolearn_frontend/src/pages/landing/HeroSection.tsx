    // src/components/landing/HeroSection.tsx
    import { motion } from 'motion/react';
    import { Button } from '../../components/ui/button';
    import { Star, Sparkles, ArrowRight, Award } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';
    import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
    import { FloatingIcon } from './FloatingIcon';

    export const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 px-4 py-16 sm:px-6 lg:px-8">
        {/* Floating icons */}
        <FloatingIcon delay={0}><div className="absolute top-20 left-10 text-6xl opacity-20">🌱</div></FloatingIcon>
        <FloatingIcon delay={1}><div className="absolute top-40 right-20 text-5xl opacity-20">🦋</div></FloatingIcon>
        <FloatingIcon delay={2}><div className="absolute bottom-40 left-1/4 text-4xl opacity-20">☀️</div></FloatingIcon>
        <FloatingIcon delay={1.5}><div className="absolute top-60 right-1/3 text-5xl opacity-20">🌍</div></FloatingIcon>

        <div className="container mx-auto relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                    size="lg"
                    className="text-lg rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-xl border-4 border-green-300"
                    onClick={() => navigate('/register')}
                    >
                    <Sparkles className="mr-2 h-6 w-6" /> Start Your Adventure!
                    <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

            {/* Right Content */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
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
    );
    };
