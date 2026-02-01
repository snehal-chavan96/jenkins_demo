import { useState } from 'react';
import { Target, Clock, X, CheckCircle, Image as ImageIcon, Leaf, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { GlassCard } from '../components/gamification/GlassCard';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { ecopointsAPI } from '../services/ecopoints';
// import { useEcoPoints } from '../context/EcoPointsContext';
import { useAuth } from '../context/AuthContext';
import { epicChallengeAPI } from '../services/epicChallenge';


interface Challenge {
  id: string;
  title: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  ecoPoints: number;
  description: string;
  completed: boolean;
}

export const EpicChallenges = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [submission, setSubmission] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completedPoints, setCompletedPoints] = useState(0);

  const { user } = useAuth();

  // const { setEcoPoints } = useEcopoints();
  const token = localStorage.getItem("ecolearn_token");

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Plant a Tree',
      icon: '🌳',
      difficulty: 'Medium',
      duration: '2 weeks',
      ecoPoints: 1000,
      description: 'Plant a tree in your community and document the process. Share photos of the planting location and the tree species. Track its growth over the next few weeks!',
      completed: false,
    },
    {
      id: '2',
      title: 'Zero Waste Week',
      icon: '♻️',
      difficulty: 'Hard',
      duration: '1 week',
      ecoPoints: 750,
      description: 'Challenge yourself to produce zero waste for an entire week. Document your journey, share tips, and explain how you eliminated single-use plastics.',
      completed: false,
    },
    {
      id: '3',
      title: 'Energy Conservation',
      icon: '⚡',
      difficulty: 'Easy',
      duration: '30 mins',
      ecoPoints: 250,
      description: 'Identify 5 ways to save energy at home and implement them. Record your findings and estimate the energy savings. Share your tips with others!',
      completed: false,
    },
    {
      id: '4',
      title: 'School Garden Cleanup',
      icon: '🌱',
      difficulty: 'Medium',
      duration: '1 day',
      ecoPoints: 500,
      description: 'Organize or participate in a school garden cleanup. Take before and after photos, list what you collected, and explain how this helps the environment.',
      completed: false,
    },
    {
      id: '5',
      title: 'Water Saving Challenge',
      icon: '💧',
      difficulty: 'Easy',
      duration: '1 day',
      ecoPoints: 300,
      description: 'Track your water usage for a day and find creative ways to reduce consumption by 20%. Share your water-saving strategies and results!',
      completed: false,
    },
    {
      id: '6',
      title: 'Recycling Craft',
      icon: '🖌️',
      difficulty: 'Medium',
      duration: '2 days',
      ecoPoints: 400,
      description: 'Create something useful from recyclable materials. Share photos of your creative project and explain what materials you used and why it\'s eco-friendly.',
      completed: false,
    },
    {
      id: '7',
      title: 'Nature Observation',
      icon: '👀',
      difficulty: 'Easy',
      duration: '1 hour',
      ecoPoints: 200,
      description: 'Spend an hour observing nature in your area. Document 10 different species you encounter (plants, birds, insects). Share your observations!',
      completed: false,
    },
    {
      id: '8',
      title: 'Plastic-Free Lunch',
      icon: '🥪',
      difficulty: 'Easy',
      duration: '1 day',
      ecoPoints: 250,
      description: 'Pack a completely plastic-free lunch for a day. Share photos of your eco-friendly meal and list the sustainable alternatives you used.',
      completed: false,
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'from-green-400 to-green-600';
      case 'Medium':
        return 'from-yellow-400 to-orange-500';
      case 'Hard':
        return 'from-red-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getDifficultyBgColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-orange-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedChallenge || !user) return;

    try {
      await epicChallengeAPI.submit({
        studentId: Number(user.id),
        challengeTitle: selectedChallenge.title,
        ecoPoints: selectedChallenge.ecoPoints,
        description: submission,
        imageUrl: uploadedImage || undefined,
      });

      toast.success(
        "Challenge submitted! Awaiting teacher approval 🌱"
      );

      // Mark locally as pending (NOT completed)
      setChallenges(prev =>
        prev.map(c =>
          c.id === selectedChallenge.id
            ? { ...c, completed: false }
            : c
        )
      );

      setSelectedChallenge(null);
      setSubmission("");
      setUploadedImage(null);

    } catch (err) {
      console.error(err);
      toast.error("Failed to submit challenge");
    }
  };



  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSelectedChallenge(null);
  };

  const handleParticipate = (challenge: Challenge) => {
    if (!challenge.completed) {
      setSelectedChallenge(challenge);
      setShowSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300 px-4 py-8 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl">🎯</div>
            <div>
              <h1 className="text-4xl sm:text-5xl text-gray-900 dark:text-white">
                Epic Challenges
              </h1>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Complete real-life eco activities and earn EcoPoints.
          </p>
        </motion.div>

        {/* Challenge Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + (index * 0.05) }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <GlassCard
                gradient={challenge.completed ? 'from-gray-100/60 to-gray-200/60' : 'from-white/60 to-white/40'}
                borderColor={challenge.completed ? 'border-gray-300' : 'border-orange-200'}
                className="relative"
              >
                {/* Completed Badge */}
                {challenge.completed && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-500 text-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  {/* Icon */}
                  <motion.div
                    className="text-7xl mb-4 text-center"
                    animate={challenge.completed ? {} : { scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {challenge.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl text-gray-900 dark:text-white mb-3 text-center">
                    {challenge.title}
                  </h3>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <Badge className={`${getDifficultyBgColor(challenge.difficulty)} text-white rounded-full px-3 py-1.5`}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge className="bg-blue-500 text-white rounded-full px-3 py-1.5 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {challenge.duration}
                    </Badge>
                  </div>

                  {/* EcoPoints */}
                  <div className="mb-5 text-center">
                    <div className="inline-flex items-center gap-2 bg-green-100/80 dark:bg-green-900/40 rounded-2xl px-5 py-3 backdrop-blur-sm border-2 border-green-300/60 dark:border-green-700/60">
                      <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <span className="text-2xl text-green-600 dark:text-green-400">
                        +{challenge.ecoPoints}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleParticipate(challenge)}
                      disabled={challenge.completed}
                      className={`w-full rounded-2xl text-lg py-6 ${challenge.completed
                          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700'
                        } text-white shadow-lg`}
                    >
                      {challenge.completed ? 'Completed' : 'Participate'}
                    </Button>
                  </motion.div>
                </CardContent>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Challenge Submission Modal */}
      <AnimatePresence>
        {selectedChallenge && !showSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedChallenge(null);
                setSubmission('');
                setUploadedImage(null);
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <GlassCard gradient="from-white/95 to-white/90" borderColor="border-orange-300" className="shadow-2xl">
                {/* Close Button */}
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedChallenge(null);
                      setSubmission('');
                      setUploadedImage(null);
                    }}
                    className="h-10 w-10 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <CardContent className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      className="text-8xl mb-4"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {selectedChallenge.icon}
                    </motion.div>
                    <h2 className="text-3xl text-gray-900 dark:text-white mb-3">
                      {selectedChallenge.title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {selectedChallenge.description}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Badge className={`${getDifficultyBgColor(selectedChallenge.difficulty)} text-white rounded-full px-4 py-2`}>
                        {selectedChallenge.difficulty}
                      </Badge>
                      <Badge className="bg-blue-500 text-white rounded-full px-4 py-2 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedChallenge.duration}
                      </Badge>
                      <Badge className="bg-green-500 text-white rounded-full px-4 py-2 flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        +{selectedChallenge.ecoPoints} Points
                      </Badge>
                    </div>
                  </div>

                  {/* Submission Form */}
                  <div className="space-y-6">
                    {/* Text Submission */}
                    <div>
                      <label className="block mb-2 text-gray-900 dark:text-white">
                        Your Submission (Optional)
                      </label>
                      <Textarea
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        placeholder="Share your experience, findings, or progress..."
                        className="min-h-32 rounded-2xl border-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 resize-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block mb-2 text-gray-900 dark:text-white">
                        Upload Image (Optional)
                      </label>

                      {uploadedImage ? (
                        <div className="relative">
                          <img
                            src={uploadedImage}
                            alt="Upload preview"
                            className="w-full h-64 object-cover rounded-2xl border-2 border-gray-300 dark:border-gray-600"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUploadedImage(null)}
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white p-0 shadow-lg"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-orange-500 dark:hover:border-orange-500 transition-colors cursor-pointer bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400 mb-1">
                              Click to upload an image
                            </p>
                            <p className="text-gray-500 dark:text-gray-500">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleSubmit}
                        className="w-full rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white text-lg py-6 shadow-lg"
                      >
                        <CheckCircle className="mr-2 h-6 w-6" />
                        Submit Challenge
                      </Button>
                    </motion.div>

                    {/* Info Note */}
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      By submitting, you confirm that you have completed this challenge honestly.
                    </p>
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Success Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-md"
            >
              <GlassCard gradient="from-green-100/95 to-green-50/95" borderColor="border-green-300" className="shadow-2xl">
                <CardContent className="p-8 text-center">
                  {/* Animated Success Icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 0.6 }}
                    className="text-8xl mb-4"
                  >
                    🎉
                  </motion.div>

                  {/* Success Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-center space-y-3">
                      <div className="text-5xl">⏳</div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Submission Under Review
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400">
                        Great job taking action for the environment!
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Your EcoPoints will be added once a teacher approves your submission 🌱
                      </p>
                    </div>

                    {/* Close Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleCloseSuccess}
                        className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg py-6 shadow-lg"
                      >
                        Continue
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
