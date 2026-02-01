import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Award, TrendingUp, Plus, BarChart3, Sparkles, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { PageLoader } from '../components/common/Loader';
import bgImage from '../components/assets/bg-5.jpg';
export const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) return <PageLoader />;

  const stats = [
    { label: 'Students', value: 45, icon: Users, color: 'from-blue-400 to-blue-600', emoji: '👥' },
    { label: 'Courses', value: 6, icon: BookOpen, color: 'from-green-400 to-green-600', emoji: '📚' },
    { label: 'Engagement', value: '87%', icon: TrendingUp, color: 'from-purple-400 to-purple-600', emoji: '📊' },
    { label: 'Eco-Points', value: '125K', icon: Award, color: 'from-orange-400 to-orange-600', emoji: '🌿' },
  ];

  const recentCourses = [
    { id: 1, name: 'Climate Change 101', students: 18, completion: 65, status: 'Active' },
    { id: 2, name: 'Sustainable Living', students: 15, completion: 42, status: 'Active' },
    { id: 3, name: 'Renewable Energy', students: 12, completion: 78, status: 'Active' },
  ];

const topStudents = [
  { id: 1, name: 'Snehal Chavan', points: 9500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Snehal' },
  { id: 2, name: 'Tanmay Sharma', points: 9200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanmay' },
  { id: 3, name: 'Ananya Singh', points: 8800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya' },
  { id: 4, name: 'Rohan Patel', points: 8600, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan' },
  { id: 5, name: 'Priya Reddy', points: 8300, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
];

  return (
    <>
     <div
      className="min-h-screen bg-contain bg-center px-4 py-6 sm:py-8 lg:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
    {/* <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:py-8 lg:px-8"> */}
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Teacher Dashboard
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">Manage courses and track student progress</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-xl">
                <Plus className="mr-2 h-5 w-5" />
                Create Course
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-6 sm:mb-8 grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className={`border-3 border-green-200 dark:border-green-700 rounded-xl sm:rounded-2xl shadow-xl bg-gradient-to-br ${stat.color} bg-opacity-10 dark:bg-opacity-20`}>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
                    <div className="text-center sm:text-left">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1 justify-center sm:justify-start">
                        <span>{stat.emoji}</span>
                        <span>{stat.label}</span>
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <motion.div 
                      className={`flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Active Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-3 sm:border-4 border-green-200 dark:border-green-700 rounded-2xl sm:rounded-3xl shadow-xl bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                    Your Courses
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">Monitor progress and engagement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {recentCourses.map((course, idx) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="rounded-xl sm:rounded-2xl border-2 border-green-200 dark:border-green-700 p-3 sm:p-4 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                        <div>
                          <h3 className="mb-1 text-base sm:text-lg dark:text-white">{course.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{course.students} students enrolled</p>
                        </div>
                        <span className="rounded-full bg-green-500 px-3 py-1 text-white text-xs sm:text-sm">
                          {course.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={course.completion} className="flex-1 h-2 sm:h-3" />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{course.completion}%</span>
                      </div>
                    </motion.div>
                  ))}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 sm:h-14 text-base sm:text-lg rounded-xl sm:rounded-2xl border-2 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      Manage All Courses
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-3 sm:border-4 border-green-200 dark:border-green-700 rounded-2xl sm:rounded-3xl shadow-xl bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">Common tasks and tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:gap-4 grid-cols-2">
                    {[
                      { icon: Plus, label: 'Create Quiz', color: 'from-blue-400 to-blue-600' },
                      { icon: BookOpen, label: 'Assign Challenge', color: 'from-green-400 to-green-600' },
                      { icon: BarChart3, label: 'View Analytics', color: 'from-purple-400 to-purple-600' },
                      { icon: Users, label: 'Manage Students', color: 'from-orange-400 to-orange-600' }
                    ].map((action, idx) => (
                      <motion.div
                        key={action.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          className={`h-20 sm:h-24 w-full flex-col gap-2 rounded-xl sm:rounded-2xl border-2 hover:bg-gradient-to-br ${action.color} hover:text-white hover:border-transparent transition-all`}
                        >
                          <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                          <span className="text-xs sm:text-sm">{action.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          
        </div>
      </div>
    </div>
    </>
  );
};