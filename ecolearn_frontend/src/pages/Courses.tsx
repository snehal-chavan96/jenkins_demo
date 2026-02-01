import { useState } from 'react';
import { BookOpen, Clock, CheckCircle, X, Play, Award, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: 'Beginner' | 'Advanced';
  videoId: string;
  thumbnail: string;
  ecoPoints: number;
  completed: boolean;
  progress: number;
}

export const Courses = () => {
  const [filterLevel, setFilterLevel] = useState<'All' | 'Beginner' | 'Advanced'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Climate Change 1',
      description: 'Learn the basics of climate science and solutions',
      duration: '15 mins',
      lessons: 3,
      level: 'Beginner',
      videoId: '41Bt4eOg6HU',
      thumbnail: 'https://img.youtube.com/vi/41Bt4eOg6HU/maxresdefault.jpg',

      ecoPoints: 50,
      completed: false,
      progress: 0,
    },
    {
      id: '2',
      title: 'Renewable Energy',
      description: 'Discover clean energy sources for our future',
      duration: '20 mins',
      lessons: 4,
      level: 'Beginner',
      videoId: 'Giek094C_l4',
      thumbnail: 'https://img.youtube.com/vi/Giek094C_l4/maxresdefault.jpg',

      ecoPoints: 60,
      completed: true,
      progress: 100,
    },
    {
      id: '3',
      title: 'Ocean Conservation',
      description: 'Protect our oceans and marine life',
      duration: '18 mins',
      lessons: 3,
      level: 'Beginner',
      videoId: 'ju_2NuK5O-E',
      thumbnail: 'https://img.youtube.com/vi/ju_2NuK5O-E/maxresdefault.jpg',

      ecoPoints: 55,
      completed: false,
      progress: 60,
    },
    {
      id: '4',
      title: 'Recycling',
      description: 'Master the art of waste management',
      duration: '12 mins',
      lessons: 2,
      level: 'Beginner',
      videoId: '6jQ7y_qQYUA',
      thumbnail: 'https://img.youtube.com/vi/6jQ7y_qQYUA/maxresdefault.jpg',

      ecoPoints: 40,
      completed: false,
      progress: 0,
    },
    {
      id: '5',
      title: 'Biodiversity',
      description: 'Understand ecosystems and species protection',
      duration: '25 mins',
      lessons: 5,
      level: 'Advanced',
      videoId: 'GK_vRtHJZu4',
      thumbnail: 'https://img.youtube.com/vi/GK_vRtHJZu4/maxresdefault.jpg',

      ecoPoints: 80,
      completed: false,
      progress: 0,
    },
    {
      id: '6',
      title: 'Sustainability',
      description: 'Advanced strategies for sustainable living',
      duration: '30 mins',
      lessons: 6,
      level: 'Advanced',
      videoId: 'zx04Kl8y4dE',
      thumbnail: 'https://img.youtube.com/vi/zx04Kl8y4dE/maxresdefault.jpg',

      ecoPoints: 100,
      completed: false,
      progress: 25,
    },
  ]);

  const filteredCourses = courses.filter(course =>
    filterLevel === 'All' || course.level === filterLevel
  );

  const handleMarkComplete = () => {
    if (!selectedCourse) return;

    setCourses(prev =>
      prev.map(course =>
        course.id === selectedCourse.id
          ? { ...course, completed: true, progress: 100 }
          : course
      )
    );

    setSelectedCourse(prev => prev ? { ...prev, completed: true, progress: 100 } : null);

    toast.success(`Congrats! 🎉 You earned +${selectedCourse.ecoPoints} EcoPoints!`, {
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="h-6 w-6 text-yellow-500" />
            <span className="text-green-600 dark:text-green-400 text-lg font-medium">
              Learn & Grow!
            </span>
            <Star className="h-6 w-6 text-yellow-500" />
          </motion.div>

          <h1 className="mb-3 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 
                         dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
            Explore Eco Courses 🌍
          </h1>

          <p className="text-gray-700 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Short, fun, beginner-friendly learning videos to make you an Eco-Hero! 🌱✨
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex gap-3 justify-center flex-wrap"
        >
          {(['All', 'Beginner', 'Advanced'] as const).map(level => (
            <Button
              key={level}
              onClick={() => setFilterLevel(level)}
              variant={filterLevel === level ? 'default' : 'outline'}
              className={`rounded-xl px-6 h-11 ${filterLevel === level
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'border-2 border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500'
                }`}
            >
              {level}
            </Button>
          ))}
        </motion.div>

        {/* Courses Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden bg-white dark:bg-gray-800 flex flex-col h-full">

                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">

                    <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-8 w-8 text-green-600 ml-1" />
                    </div>
                  </div>
                  {course.completed && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                        <CheckCircle className="h-4 w-4" /> Completed
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`${course.level === 'Beginner' ? 'bg-green-500' : 'bg-purple-500'} text-white rounded-full px-3 py-1 shadow-lg`}
                    >
                      {course.level}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">{course.description}</p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {course.progress > 0 && !course.completed && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  {/* Button */}
                  <Button
                    onClick={() => setSelectedCourse(course)}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
                  >
                    {course.completed ? 'Watch Again' : course.progress > 0 ? 'Continue' : 'Start Course'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg bg-white dark:bg-gray-800 max-w-md mx-auto">
              <CardContent className="p-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Courses Found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Modal */}
        {/* Modal */}
        {/* Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCourse(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   z-50 w-[95%] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
              >
                <Card className="flex flex-col h-full border-4 border-green-300 dark:border-green-700 rounded-3xl shadow-2xl bg-white dark:bg-gray-800 overflow-hidden">

                  {/* Close Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCourse(null)}
                      className="h-10 w-10 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-lg p-0"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Video */}
                  {/* Video */}
                  <div className="w-full h-[90vh] flex-shrink-1 bg-black rounded-2xl overflow-hidden mb-4">
                    <iframe
                      key={selectedCourse.videoId}
                      src={`https://www.youtube.com/embed/${selectedCourse.videoId}?rel=0&modestbranding=1&autoplay=0`}
                      title={selectedCourse.title}
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>


                  {/* Content below video */}
                  <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {/* Title & Badge */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{selectedCourse.title}</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">{selectedCourse.description}</p>
                      </div>
                      <Badge className={`${selectedCourse.level === 'Beginner' ? 'bg-green-500' : 'bg-purple-500'} text-white rounded-full px-3 py-1 text-sm whitespace-nowrap`}>
                        {selectedCourse.level}
                      </Badge>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mb-4 text-gray-600 dark:text-gray-400 text-sm">
                      <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{selectedCourse.duration}</div>
                      <div className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{selectedCourse.lessons} lessons</div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400"><Award className="h-4 w-4" />+{selectedCourse.ecoPoints} EcoPoints</div>
                    </div>

                    {/* Progress */}
                    {selectedCourse.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span className="font-semibold">Course Progress</span>
                          <span>{selectedCourse.progress}%</span>
                        </div>
                        <Progress value={selectedCourse.progress} className="h-2" />
                      </div>
                    )}

                    {/* Action Button */}
                    {!selectedCourse.completed ? (
                      <Button
                        onClick={handleMarkComplete}
                        className="w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-base sm:text-lg shadow-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" /> Mark as Completed
                      </Button>
                    ) : (
                      <div className="text-center p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-300 dark:border-green-700">
                        <div className="text-4xl sm:text-5xl mb-2">🎉</div>
                        <h3 className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 mb-1">Course Completed!</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">You earned +{selectedCourse.ecoPoints} EcoPoints</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>


      </div>
    </div>
  );
};