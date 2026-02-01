import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, GraduationCap, Bell, TrendingUp, Award, 
  BookOpen, Calendar, Activity, BarChart3, UserPlus 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ProgressRing } from '../components/gamification/ProgressRing';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const statsData = [
  { month: 'Jan', students: 245, teachers: 18, ecoPoints: 12400 },
  { month: 'Feb', students: 268, teachers: 20, ecoPoints: 15600 },
  { month: 'Mar', students: 292, teachers: 22, ecoPoints: 18900 },
  { month: 'Apr', students: 315, teachers: 23, ecoPoints: 21200 },
  { month: 'May', students: 340, teachers: 25, ecoPoints: 24800 },
  { month: 'Jun', students: 365, teachers: 27, ecoPoints: 28500 },
];

const topPerformers = [
  { id: 1, name: 'Sarah Johnson', role: 'Student', ecoPoints: 2450, avatar: '' },
  { id: 2, name: 'Mr. Thompson', role: 'Teacher', ecoPoints: 2180, avatar: '' },
  { id: 3, name: 'Alex Martinez', role: 'Student', ecoPoints: 2020, avatar: '' },
  { id: 4, name: 'Ms. Chen', role: 'Teacher', ecoPoints: 1890, avatar: '' },
  { id: 5, name: 'Emma Williams', role: 'Student', ecoPoints: 1750, avatar: '' },
];

const recentActivities = [
  { id: 1, text: 'New course "Climate Change 101" published', time: '2 hours ago', type: 'course' },
  { id: 2, text: '15 students completed Water Conservation Challenge', time: '5 hours ago', type: 'challenge' },
  { id: 3, text: 'Monthly eco-goals achieved! 🎉', time: '1 day ago', type: 'achievement' },
  { id: 4, text: 'New teacher "Dr. Smith" joined', time: '2 days ago', type: 'user' },
  { id: 5, text: 'School reached 25,000 total eco-points', time: '3 days ago', type: 'milestone' },
];

export function InstitutionDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3FB984] to-[#3069F0] bg-clip-text text-transparent">
              Institution Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Green Valley High School • Manage your eco-education platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] hover:from-[#2d8a5f] hover:to-[#3FB984] rounded-xl shadow-lg">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Users
            </Button>
            <Button variant="outline" className="rounded-xl border-2 hover:border-[#3FB984]">
              <Bell className="w-4 h-4 mr-2" />
              Announcements
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Students',
              value: '365',
              change: '+12%',
              icon: Users,
              color: 'from-[#3FB984] to-[#2d8a5f]',
              bgColor: 'from-[#3FB984]/20 to-[#2d8a5f]/20',
            },
            {
              title: 'Active Teachers',
              value: '27',
              change: '+2',
              icon: GraduationCap,
              color: 'from-[#3069F0] to-[#2451c7]',
              bgColor: 'from-[#3069F0]/20 to-[#2451c7]/20',
            },
            {
              title: 'Total Eco-Points',
              value: '28,500',
              change: '+15%',
              icon: Award,
              color: 'from-[#FFD166] to-[#f5b93d]',
              bgColor: 'from-[#FFD166]/20 to-[#f5b93d]/20',
            },
            {
              title: 'Courses Active',
              value: '24',
              change: '+3',
              icon: BookOpen,
              color: 'from-purple-500 to-purple-600',
              bgColor: 'from-purple-500/20 to-purple-600/20',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-2 border-white/20 dark:border-white/10 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <h3 className="text-3xl font-bold">{stat.value}</h3>
                      <Badge variant="secondary" className={`bg-gradient-to-r ${stat.bgColor}`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="glass-card p-1 h-auto">
            <TabsTrigger value="overview" className="rounded-lg px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3FB984] data-[state=active]:to-[#2d8a5f] data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3FB984] data-[state=active]:to-[#2d8a5f] data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3FB984] data-[state=active]:to-[#2d8a5f] data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="glass-card border-2 border-white/20 dark:border-white/10">
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                  <CardDescription>Students and eco-points over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={statsData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #3FB984',
                          borderRadius: '12px',
                        }}
                      />
                      <Line type="monotone" dataKey="students" stroke="#3FB984" strokeWidth={3} />
                      <Line type="monotone" dataKey="ecoPoints" stroke="#3069F0" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="glass-card border-2 border-white/20 dark:border-white/10">
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Leaderboard for this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <motion.div
                      key={performer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#FFD166] to-[#f5b93d] font-bold text-gray-800">
                        {index + 1}
                      </div>
                      <Avatar>
                        <AvatarImage src={performer.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#3FB984] to-[#2d8a5f] text-white">
                          {performer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{performer.name}</p>
                        <p className="text-sm text-muted-foreground">{performer.role}</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-[#3FB984] to-[#2d8a5f] text-white">
                        {performer.ecoPoints} pts
                      </Badge>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="glass-card border-2 border-white/20 dark:border-white/10">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates across your institution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/50 transition-colors"
                    >
                      <div className="w-2 h-2 mt-2 rounded-full bg-[#3FB984]" />
                      <div className="flex-1">
                        <p>{activity.text}</p>
                        <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-card border-2 border-white/20 dark:border-white/10">
              <CardHeader>
                <CardTitle>Engagement Analytics</CardTitle>
                <CardDescription>Monthly user engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #3FB984',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="students" fill="#3FB984" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="teachers" fill="#3069F0" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="glass-card border-2 border-white/20 dark:border-white/10">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage students and teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Eco-Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPerformers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-[#3FB984] to-[#2d8a5f] text-white">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.ecoPoints}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}