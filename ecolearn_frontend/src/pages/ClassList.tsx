import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Trophy,
  Star,
  Award,
  TrendingUp,
  Filter,
  Download,
  Mail,
  ChevronDown,
  UserPlus,
  Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { PageLoader } from '../components/common/Loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  progress: number;
  xp: number;
  badges: number;
  rank: number;
  status: 'excellent' | 'good' | 'average' | 'needs-improvement';
  class: string;
  joinedDate: string;
}

export const StudentList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [sortBy, setSortBy] = useState('rank');
  const [showAddModal, setShowAddModal] = useState(false);

  // Redirect if not a teacher
  useEffect(() => {
    if (user && user.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Sample student data
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      progress: 95,
      xp: 8950,
      badges: 12,
      rank: 1,
      status: 'excellent',
      class: 'Climate Change 101',
      joinedDate: 'Sep 2024'
    },
    {
      id: '2',
      name: 'Michael Torres',
      email: 'michael.torres@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      progress: 92,
      xp: 8720,
      badges: 11,
      rank: 2,
      status: 'excellent',
      class: 'Climate Change 101',
      joinedDate: 'Sep 2024'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma.wilson@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      progress: 88,
      xp: 7890,
      badges: 10,
      rank: 3,
      status: 'excellent',
      class: 'Sustainable Living',
      joinedDate: 'Aug 2024'
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      progress: 85,
      xp: 7654,
      badges: 9,
      rank: 4,
      status: 'good',
      class: 'Climate Change 101',
      joinedDate: 'Sep 2024'
    },
    {
      id: '5',
      name: 'Sophia Martinez',
      email: 'sophia.martinez@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
      progress: 82,
      xp: 7123,
      badges: 8,
      rank: 5,
      status: 'good',
      class: 'Renewable Energy',
      joinedDate: 'Jul 2024'
    },
    {
      id: '6',
      name: 'James Anderson',
      email: 'james.anderson@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      progress: 78,
      xp: 6543,
      badges: 7,
      rank: 6,
      status: 'good',
      class: 'Ocean Conservation',
      joinedDate: 'Jun 2024'
    },
    {
      id: '7',
      name: 'Olivia Brown',
      email: 'olivia.brown@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
      progress: 72,
      xp: 5890,
      badges: 6,
      rank: 7,
      status: 'average',
      class: 'Sustainable Living',
      joinedDate: 'Aug 2024'
    },
    {
      id: '8',
      name: 'Ethan Davis',
      email: 'ethan.davis@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
      progress: 68,
      xp: 5234,
      badges: 5,
      rank: 8,
      status: 'average',
      class: 'Climate Change 101',
      joinedDate: 'Sep 2024'
    },
    {
      id: '9',
      name: 'Ava Taylor',
      email: 'ava.taylor@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
      progress: 58,
      xp: 4321,
      badges: 4,
      rank: 9,
      status: 'needs-improvement',
      class: 'Urban Gardening',
      joinedDate: 'May 2024'
    },
    {
      id: '10',
      name: 'Noah Johnson',
      email: 'noah.johnson@school.edu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah',
      progress: 55,
      xp: 3987,
      badges: 3,
      rank: 10,
      status: 'needs-improvement',
      class: 'Climate Change 101',
      joinedDate: 'Sep 2024'
    },
  ]);

  // Get unique classes for filter
  const classes = ['all', ...Array.from(new Set(students.map(s => s.class)))];

  // Filter and sort students
  let filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // Sort students
  filteredStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'rank':
        return a.rank - b.rank;
      case 'progress':
        return b.progress - a.progress;
      case 'xp':
        return b.xp - a.xp;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'excellent':
        return 'from-green-400 to-emerald-600';
      case 'good':
        return 'from-blue-400 to-cyan-600';
      case 'average':
        return 'from-yellow-400 to-orange-600';
      case 'needs-improvement':
        return 'from-red-400 to-pink-600';
    }
  };

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'excellent':
        return { label: 'Excellent', color: 'bg-green-500' };
      case 'good':
        return { label: 'Good', color: 'bg-blue-500' };
      case 'average':
        return { label: 'Average', color: 'bg-yellow-500' };
      case 'needs-improvement':
        return { label: 'Needs Support', color: 'bg-red-500' };
    }
  };

  const handleViewStudent = (studentId: string) => {
    console.log('View student:', studentId);
    // Navigate to student profile
  };

  if (isLoading) return <PageLoader />;

  // Calculate stats
  const totalStudents = students.length;
  const avgProgress = Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length);
  const totalXP = students.reduce((sum, s) => sum + s.xp, 0);
  const topPerformers = students.filter(s => s.status === 'excellent').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:py-8 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                  My Students
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                Track and manage student progress across all classes
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button 
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Student
              </Button>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Progress</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgProgress}%</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 text-white shadow-lg">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total XP</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalXP.toLocaleString()}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-600 text-white shadow-lg">
                      <Zap className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="border-2 border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top Performers</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{topPerformers}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 text-white shadow-lg">
                      <Trophy className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Search, Filter, and Sort Bar */}
          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search students by name, email, or class..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 transition-colors"
                  />
                </div>

                {/* Class Filter */}
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full lg:w-48 h-12 rounded-xl border-2">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>
                        {cls === 'all' ? 'All Classes' : cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48 h-12 rounded-xl border-2">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rank">By Rank</SelectItem>
                    <SelectItem value="progress">By Progress</SelectItem>
                    <SelectItem value="xp">By XP</SelectItem>
                    <SelectItem value="name">By Name</SelectItem>
                  </SelectContent>
                </Select>

                {/* Export Button */}
                <Button
                  variant="outline"
                  className="w-full lg:w-auto h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Students Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
              >
                <Card className={`border-3 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all bg-white dark:bg-gray-800 ${
                  student.rank <= 3 ? 'border-yellow-300 dark:border-yellow-600 ring-2 ring-yellow-200 dark:ring-yellow-800' : 'border-green-200 dark:border-green-700'
                }`}>
                  {/* Rank Badge (for top 3) */}
                  {student.rank <= 3 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${
                        student.rank === 1 ? 'from-yellow-400 to-orange-500' :
                        student.rank === 2 ? 'from-gray-300 to-gray-400' :
                        'from-orange-300 to-orange-500'
                      } text-white shadow-lg font-bold text-lg`}>
                        #{student.rank}
                      </div>
                    </div>
                  )}

                  {/* Card Header with Gradient */}
                  <div className={`h-20 bg-gradient-to-br ${getStatusColor(student.status)} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  <CardContent className="p-6 -mt-10 relative">
                    {/* Avatar */}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-xl">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-600 text-white text-xl">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 mt-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                              {student.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Class Info */}
                    <div className="mb-4">
                      <Badge className="bg-blue-500 text-white rounded-full px-3 py-1">
                        {student.class}
                      </Badge>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-4 mb-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Course Progress
                          </span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {student.progress}%
                          </span>
                        </div>
                        <Progress value={student.progress} className="h-3" />
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        {/* XP */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-3 border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">XP</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {student.xp.toLocaleString()}
                          </p>
                        </div>

                        {/* Badges */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Badges</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {student.badges}
                          </p>
                        </div>

                        {/* Rank */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Rank</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            #{student.rank}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <Badge className={`${getStatusBadge(student.status).color} text-white rounded-full px-3 py-1`}>
                        {getStatusBadge(student.status).label}
                      </Badge>
                    </div>

                    {/* Action Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleViewStudent(student.id)}
                        className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl bg-white dark:bg-gray-800">
              <CardContent className="p-12">
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No students found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Get started by adding your first student'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="h-12 px-8 text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Your First Student
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add Student Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-green-200 dark:border-green-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Add New Student
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => setShowAddModal(false)}
                      className="rounded-full"
                    >
                      <span className="text-2xl">×</span>
                    </Button>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., John"
                          className="h-12 rounded-xl border-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., Doe"
                          className="h-12 rounded-xl border-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="student@school.edu"
                        className="h-12 rounded-xl border-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Assign to Class
                      </label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl border-2">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.filter(c => c !== 'all').map(cls => (
                            <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 h-12 rounded-xl border-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <UserPlus className="mr-2 h-5 w-5" />
                        Add Student
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};