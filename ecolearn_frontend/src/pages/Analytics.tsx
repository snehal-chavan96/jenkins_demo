import { useState, useEffect } from 'react';
import { TrendingUp, Award, Target, BookOpen, Calendar, Zap, BarChart3, PieChart, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PageLoader } from '../components/common/Loader';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

export const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) return <PageLoader />;

  // Mock data for charts
  const weeklyProgress = [
    { day: 'Mon', points: 120, quizzes: 2, courses: 1 },
    { day: 'Tue', points: 180, quizzes: 3, courses: 0 },
    { day: 'Wed', points: 240, quizzes: 4, courses: 2 },
    { day: 'Thu', points: 160, quizzes: 2, courses: 1 },
    { day: 'Fri', points: 320, quizzes: 5, courses: 2 },
    { day: 'Sat', points: 280, quizzes: 4, courses: 1 },
    { day: 'Sun', points: 200, quizzes: 3, courses: 1 },
  ];

  const courseProgress = [
    { name: 'Climate Change', completion: 85, points: 850, color: '#22c55e' },
    { name: 'Renewable Energy', completion: 65, points: 650, color: '#3b82f6' },
    { name: 'Waste Reduction', completion: 90, points: 900, color: '#8b5cf6' },
    { name: 'Water Conservation', completion: 45, points: 450, color: '#06b6d4' },
  ];

  const performanceData = [
    { subject: 'Climate', score: 92 },
    { subject: 'Energy', score: 85 },
    { subject: 'Waste', score: 95 },
    { subject: 'Water', score: 78 },
    { subject: 'Biodiversity', score: 88 },
  ];

  const activityDistribution = [
    { name: 'Courses', value: 45, color: '#22c55e' },
    { name: 'Quizzes', value: 30, color: '#3b82f6' },
    { name: 'Challenges', value: 15, color: '#f59e0b' },
    { name: 'Community', value: 10, color: '#8b5cf6' },
  ];

  const streakData = [
    { week: 'W1', streak: 3 },
    { week: 'W2', streak: 5 },
    { week: 'W3', streak: 7 },
    { week: 'W4', streak: 4 },
    { week: 'W5', streak: 9 },
    { week: 'W6', streak: 12 },
  ];

  const stats = [
    { 
      label: 'Total Points', 
      value: '8,950', 
      icon: Award, 
      color: 'from-green-400 to-green-600', 
      change: '+12%',
      trend: 'up'
    },
    { 
      label: 'Courses Done', 
      value: '8', 
      icon: BookOpen, 
      color: 'from-blue-400 to-blue-600', 
      change: '+2',
      trend: 'up'
    },
    { 
      label: 'Avg. Score', 
      value: '87.6%', 
      icon: Target, 
      color: 'from-purple-400 to-purple-600', 
      change: '+5.2%',
      trend: 'up'
    },
    { 
      label: 'Current Streak', 
      value: '12 days', 
      icon: Zap, 
      color: 'from-orange-400 to-orange-600', 
      change: '🔥',
      trend: 'up'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 px-4 py-6 sm:py-8 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Your Analytics
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-700">Track your awesome progress! 📊</p>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map((range) => (
                <motion.button
                  key={range}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base transition-all ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'bg-white border-2 border-green-200 text-gray-700 hover:bg-green-50'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className={`border-3 border-green-200 rounded-xl sm:rounded-2xl shadow-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-start justify-between mb-2">
                    <motion.div 
                      className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </motion.div>
                    <div className={`text-xs sm:text-sm px-2 py-1 rounded-lg ${
                      stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border-2 border-green-200 rounded-xl p-1">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              Performance
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Weekly Progress */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-3 sm:border-4 border-green-200 rounded-2xl sm:rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Weekly Progress
                    </CardTitle>
                    <CardDescription>Your eco-points earned this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={weeklyProgress}>
                        <defs>
                          <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '2px solid #22c55e',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="points" 
                          stroke="#22c55e" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorPoints)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Streak Tracker */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-3 sm:border-4 border-orange-200 rounded-2xl sm:rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      Learning Streak
                    </CardTitle>
                    <CardDescription>Keep the fire burning! 🔥</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={streakData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="week" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '2px solid #f59e0b',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="streak" 
                          fill="url(#orangeGradient)" 
                          radius={[8, 8, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Course Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-3 sm:border-4 border-green-200 rounded-2xl sm:rounded-3xl shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Course Completion
                  </CardTitle>
                  <CardDescription>Track your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courseProgress.map((course, idx) => (
                    <motion.div
                      key={course.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <span className="text-sm sm:text-base">{course.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-green-600">{course.points} pts</span>
                          <span className="text-sm sm:text-base">{course.completion}%</span>
                        </div>
                      </div>
                      <Progress 
                        value={course.completion} 
                        className="h-2 sm:h-3"
                        style={{ 
                          '--progress-background': course.color 
                        } as React.CSSProperties}
                      />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Performance Radar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-3 sm:border-4 border-purple-200 rounded-2xl sm:rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Subject Performance
                    </CardTitle>
                    <CardDescription>Your scores across topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                        <YAxis dataKey="subject" type="category" stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '2px solid #8b5cf6',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Bar dataKey="score" fill="url(#purpleGradient)" radius={[0, 8, 8, 0]} />
                        <defs>
                          <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#a78bfa" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Distribution */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-3 sm:border-4 border-blue-200 rounded-2xl sm:rounded-3xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-blue-600" />
                      Activity Distribution
                    </CardTitle>
                    <CardDescription>How you spend your time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={activityDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent ?? 0* 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {activityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-3 sm:border-4 border-green-200 rounded-2xl sm:rounded-3xl shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Daily Activity
                  </CardTitle>
                  <CardDescription>Your learning activities over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '2px solid #22c55e',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="quizzes" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="courses" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 sm:mt-8"
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-4 border-green-300 rounded-2xl sm:rounded-3xl shadow-2xl">
            <CardContent className="p-6 sm:p-8 text-center">
              <motion.div
                className="text-5xl sm:text-6xl lg:text-7xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📈
              </motion.div>
              <h2 className="mb-3 text-2xl sm:text-3xl text-white">You're on fire! 🔥</h2>
              <p className="text-base sm:text-lg lg:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
                Your progress is amazing! Keep learning and you'll unlock even more badges soon!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
