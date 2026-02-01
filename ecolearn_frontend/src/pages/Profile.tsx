import { useState } from 'react';
import { User, Mail, School, Edit2, Save, Award, BookOpen, Target, Sparkles, Star, Camera, TrendingUp, Flame, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { XPBar } from '../components/gamification/XPBar';
import { StreakCounter } from '../components/gamification/StreakCounter';
import { AchievementBadge, Achievement } from '../components/gamification/AchievementBadge';
import { ProgressRing } from '../components/gamification/ProgressRing';
import { toast } from 'sonner@2.0.3';

const achievements: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your first course', icon: 'star', color: 'primary', isUnlocked: true, unlockedAt: '2024-01-15' },
  { id: '2', title: 'Eco Warrior', description: 'Earn 1000 eco-points', icon: 'trophy', color: 'accent', isUnlocked: true, unlockedAt: '2024-02-10' },
  { id: '3', title: 'Tree Hugger', description: 'Complete 5 environmental challenges', icon: 'award', color: 'primary', isUnlocked: true, unlockedAt: '2024-03-05' },
  { id: '4', title: 'Knowledge Seeker', description: 'Complete 10 courses', icon: 'crown', color: 'secondary', isUnlocked: false, progress: 8, total: 10 },
  { id: '5', title: 'Daily Dedication', description: 'Maintain a 30-day streak', icon: 'zap', color: 'orange', isUnlocked: false, progress: 15, total: 30 },
  { id: '6', title: 'Master Recycler', description: 'Complete all recycling challenges', icon: 'medal', color: 'primary', isUnlocked: false, progress: 3, total: 5 },
];

const enrolledCourses = [
  { id: '1', title: 'Climate Change 101', progress: 100, status: 'completed', icon: '🌍' },
  { id: '2', title: 'Sustainable Living', progress: 75, status: 'in-progress', icon: '♻️' },
  { id: '3', title: 'Renewable Energy', progress: 45, status: 'in-progress', icon: '⚡' },
  { id: '4', title: 'Ocean Conservation', progress: 100, status: 'completed', icon: '🌊' },
  { id: '5', title: 'Wildlife Protection', progress: 20, status: 'in-progress', icon: '🦁' },
];

const completedChallenges = [
  { id: '1', title: 'Eco Bubble Shooter', score: 1250, stars: 2, icon: '🫧', date: '2024-11-15' },
  { id: '2', title: 'Water Conservation', score: 890, stars: 3, icon: '💧', date: '2024-11-14' },
  { id: '3', title: 'Recycling Rush', score: 2100, stars: 2, icon: '♻️', date: '2024-11-12' },
  { id: '4', title: 'Eco Tic-Tac-Toe', score: 450, stars: 1, icon: '🌳', date: '2024-11-10' },
];

export const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    school: 'Green Valley High School',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success('Profile updated! 🎉');
    setIsEditing(false);
  };

  // Calculate level and XP
  const currentXP = user?.ecoPoints || 1240;
  const level = Math.floor(currentXP / 500) + 1;
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const currentLevelXP = currentXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;

  const stats = [
    { label: 'Level', value: level, icon: TrendingUp, color: 'from-[#3FB984] to-[#2d8a5f]', emoji: '⚡' },
    { label: 'Eco-Points', value: currentXP, icon: Award, color: 'from-[#FFD166] to-[#f5b93d]', emoji: '🌿' },
    { label: 'Courses', value: `${enrolledCourses.filter(c => c.status === 'completed').length}/${enrolledCourses.length}`, icon: BookOpen, color: 'from-[#3069F0] to-[#2451c7]', emoji: '📚' },
    { label: 'Challenges', value: completedChallenges.length, icon: Target, color: 'from-purple-500 to-purple-600', emoji: '🎯' },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header with Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Cover Banner */}
          <div className="h-48 rounded-3xl bg-gradient-to-r from-[#3FB984] via-[#3069F0] to-[#FFD166] relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  {['🌿', '🌍', '⭐', '🌱', '💧'][i % 5]}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Profile Card */}
          <Card className="glass-card border-2 border-white/20 dark:border-white/10 -mt-20 mx-4 relative z-10">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-xl">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#3FB984] to-[#2d8a5f] text-white text-4xl">
                      {user?.name?.charAt(0) || 'E'}
                    </AvatarFallback>
                  </Avatar>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] flex items-center justify-center shadow-lg"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl text-foreground">{user?.name}</h1>
                    {/* <Badge className="bg-gradient-to-r from-[#FFD166] to-[#f5b93d] text-gray-800">
                      Level {level}
                    </Badge> */}
                  </div>
                  <p className="text-muted-foreground mb-4">{user?.email}</p>

                  {/* XP Bar */}
                  {/* <div className="max-w-md">
                    <XPBar 
                      currentXP={currentLevelXP} 
                      requiredXP={xpNeeded}
                      level={level}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {xpNeeded - currentLevelXP} XP to level {level + 1}
                    </p>
                  </div> */}
                </div>

                {/* Streak Counter */}
                {/* <div>
                  <StreakCounter currentStreak={15} bestStreak={28} />
                </div> */}

                {/* Edit Button */}
                {/* {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] hover:from-[#2d8a5f] hover:to-[#3FB984] rounded-xl"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-[#3069F0] to-[#2451c7] hover:from-[#2451c7] hover:to-[#3069F0] rounded-xl"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                )} */}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-2 border-white/20 dark:border-white/10 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {stat.emoji}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div> */}

        {/* Tabbed Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <div className="sticky top-4 z-50">
            <TabsList className="glass-card p-1 h-auto backdrop-blur-xl">

              {/* <TabsTrigger value="achievements" className="rounded-lg px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3FB984] data-[state=active]:to-[#2d8a5f] data-[state=active]:text-white">
              <Award className="w-4 h-4 mr-2" />
              Achievements
              </TabsTrigger> */}
              <TabsTrigger value="courses" className="rounded-lg px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3FB984] data-[state=active]:to-[#2d8a5f] data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="challenges" className="rounded-lg px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3FB984] data-[state=active]:to-[#2d8a5f] data-[state=active]:text-white">
                <Target className="w-4 h-4 mr-2" />
                Challenges
              </TabsTrigger>
              {/* <TabsTrigger value="settings" className="rounded-lg px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3FB984] data-[state=active]:to-[#2d8a5f] data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Settings
              </TabsTrigger> */}
            </TabsList>
            </div>

            {/* Achievements Tab */}
            {/* <TabsContent value="achievements" className="space-y-6">
            <Card className="glass-card border-2 border-white/20 dark:border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#FFD166]" />
                  Your Achievements
                </CardTitle>
                <CardDescription>
                  Unlock badges by completing challenges and courses!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex flex-col items-center gap-2">
                      <AchievementBadge achievement={achievement} size="md" />
                      <div className="text-center">
                        <p className="text-xs font-semibold text-foreground">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <Card className="glass-card border-2 border-white/20 dark:border-white/10">
                <CardHeader>
                  <CardTitle>Enrolled Courses</CardTitle>
                  <CardDescription>Track your learning progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{course.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-foreground">{course.title}</h4>
                              <Badge variant={course.status === 'completed' ? 'default' : 'secondary'}>
                                {course.status === 'completed' ? '✅ Completed' : '📖 In Progress'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <Progress value={course.progress} className="flex-1" />
                              <span className="text-sm text-muted-foreground">{course.progress}%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="space-y-6">
              <Card className="glass-card border-2 border-white/20 dark:border-white/10">
                <CardHeader>
                  <CardTitle>Completed Challenges</CardTitle>
                  <CardDescription>Your gaming achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedChallenges.map((challenge) => (
                      <motion.div
                        key={challenge.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl glass-card"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{challenge.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{challenge.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{challenge.date}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < challenge.stars ? 'fill-[#FFD166] text-[#FFD166]' : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'}`}
                                  />
                                ))}
                              </div>
                              <Badge className="bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] text-white">
                                {challenge.score} pts
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="glass-card border-2 border-white/20 dark:border-white/10">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="h-12 rounded-xl bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="h-12 rounded-xl bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Input
                      id="school"
                      value={formData.school}
                      onChange={(e) => handleChange('school', e.target.value)}
                      disabled={!isEditing}
                      className="h-12 rounded-xl bg-background"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};