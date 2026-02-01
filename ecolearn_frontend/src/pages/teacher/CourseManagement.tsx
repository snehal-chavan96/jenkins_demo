import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap,
  Play,
  Users,
  Clock,
  Target,
  MoreVertical,
  Filter,
  Download,
  Copy,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { PageLoader } from '../../components/common/Loader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

interface Course {
  id: string;
  title: string;
  topic: string;
  description: string;
  lessons: number;
  students: number;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'draft' | 'archived';
  color: string;
  icon: string;
  createdDate: string;
  completionRate: number;
}

export const CourseManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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

  // Sample course data
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Climate Change 101',
      topic: 'Environmental Science',
      description: 'Understand the fundamentals of climate change, its causes, and global impacts',
      lessons: 12,
      students: 28,
      duration: '6 weeks',
      difficulty: 'beginner',
      status: 'active',
      color: 'from-green-400 to-emerald-600',
      icon: '🌍',
      createdDate: 'Sep 2024',
      completionRate: 68
    },
    {
      id: '2',
      title: 'Sustainable Living',
      topic: 'Life Skills',
      description: 'Learn practical ways to reduce your carbon footprint and live sustainably',
      lessons: 15,
      students: 32,
      duration: '8 weeks',
      difficulty: 'beginner',
      status: 'active',
      color: 'from-blue-400 to-cyan-600',
      icon: '♻️',
      createdDate: 'Aug 2024',
      completionRate: 75
    },
    {
      id: '3',
      title: 'Renewable Energy Basics',
      topic: 'Physics',
      description: 'Explore solar, wind, and other renewable energy sources for a sustainable future',
      lessons: 10,
      students: 25,
      duration: '5 weeks',
      difficulty: 'intermediate',
      status: 'active',
      color: 'from-yellow-400 to-orange-600',
      icon: '⚡',
      createdDate: 'Jul 2024',
      completionRate: 82
    },
    {
      id: '4',
      title: 'Ocean Conservation',
      topic: 'Marine Biology',
      description: 'Discover the importance of ocean ecosystems and how to protect marine life',
      lessons: 14,
      students: 30,
      duration: '7 weeks',
      difficulty: 'intermediate',
      status: 'active',
      color: 'from-cyan-400 to-blue-600',
      icon: '🌊',
      createdDate: 'Jun 2024',
      completionRate: 71
    },
    {
      id: '5',
      title: 'Urban Gardening',
      topic: 'Agriculture',
      description: 'Master the art of growing food in urban spaces and small gardens',
      lessons: 8,
      students: 20,
      duration: '4 weeks',
      difficulty: 'beginner',
      status: 'active',
      color: 'from-lime-400 to-green-600',
      icon: '🌱',
      createdDate: 'May 2024',
      completionRate: 88
    },
    {
      id: '6',
      title: 'Waste Management',
      topic: 'Environmental Science',
      description: 'Learn effective strategies for reducing, reusing, and recycling waste',
      lessons: 11,
      students: 22,
      duration: '6 weeks',
      difficulty: 'beginner',
      status: 'active',
      color: 'from-purple-400 to-pink-600',
      icon: '🗑️',
      createdDate: 'Apr 2024',
      completionRate: 65
    },
    {
      id: '7',
      title: 'Wildlife Conservation',
      topic: 'Zoology',
      description: 'Understanding biodiversity and protecting endangered species',
      lessons: 16,
      students: 0,
      duration: '8 weeks',
      difficulty: 'advanced',
      status: 'draft',
      color: 'from-orange-400 to-red-600',
      icon: '🦁',
      createdDate: 'Mar 2024',
      completionRate: 0
    },
    {
      id: '8',
      title: 'Green Technology',
      topic: 'Technology',
      description: 'Explore innovative technologies for environmental sustainability',
      lessons: 13,
      students: 0,
      duration: '7 weeks',
      difficulty: 'advanced',
      status: 'draft',
      color: 'from-teal-400 to-cyan-600',
      icon: '💡',
      createdDate: 'Feb 2024',
      completionRate: 0
    },
  ]);

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getDifficultyBadge = (difficulty: Course['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return { label: 'Beginner', color: 'bg-green-500' };
      case 'intermediate':
        return { label: 'Intermediate', color: 'bg-yellow-500' };
      case 'advanced':
        return { label: 'Advanced', color: 'bg-red-500' };
    }
  };

  const getStatusBadge = (status: Course['status']) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: 'bg-green-500' };
      case 'draft':
        return { label: 'Draft', color: 'bg-gray-500' };
      case 'archived':
        return { label: 'Archived', color: 'bg-orange-500' };
    }
  };

  const handleEdit = (courseId: string) => {
    console.log('Edit course:', courseId);
    // Navigate to course edit page or open edit modal
  };

  const handleDelete = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== courseId));
    }
  };

  const handleDuplicate = (courseId: string) => {
    const courseToDuplicate = courses.find(c => c.id === courseId);
    if (courseToDuplicate) {
      const newCourse = {
        ...courseToDuplicate,
        id: `${Date.now()}`,
        title: `${courseToDuplicate.title} (Copy)`,
        students: 0,
        status: 'draft' as const
      };
      setCourses([...courses, newCourse]);
    }
  };

  if (isLoading) return <PageLoader />;

  // Calculate stats
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.status === 'active').length;
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const avgCompletion = Math.round(
    courses.filter(c => c.status === 'active').reduce((sum, c) => sum + c.completionRate, 0) / activeCourses
  );

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
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Course Management
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                Create and manage your environmental education courses
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
                Add New Course
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Courses</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCourses}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
                      <BookOpen className="h-6 w-6" />
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Courses</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeCourses}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 text-white shadow-lg">
                      <Play className="h-6 w-6" />
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-600 text-white shadow-lg">
                      <Users className="h-6 w-6" />
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Completion</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgCompletion}%</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 text-white shadow-lg">
                      <Target className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Search and Filter Bar */}
          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses by title or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 transition-colors"
                  />
                </div>

                {/* Status Filter */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-2">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                {/* Export Button */}
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="border-3 border-green-200 dark:border-green-700 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all bg-white dark:bg-gray-800 group">
                  {/* Card Header with Gradient */}
                  <div className={`h-32 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    
                    {/* Icon */}
                    <div className="absolute top-4 left-4">
                      <div className="text-6xl">{course.icon}</div>
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => handleEdit(course.id)}
                            className="cursor-pointer rounded-lg"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(course.id)}
                            className="cursor-pointer rounded-lg"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(course.id)}
                            className="cursor-pointer rounded-lg text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Course
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-4 left-4">
                      <Badge className={`${getStatusBadge(course.status).color} text-white rounded-full px-3 py-1`}>
                        {getStatusBadge(course.status).label}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Course Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {course.title}
                    </h3>

                    {/* Topic */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {course.topic}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 min-h-[2.5rem]">
                      {course.description}
                    </p>

                    {/* Difficulty Badge */}
                    <div className="mb-4">
                      <Badge className={`${getDifficultyBadge(course.difficulty).color} text-white rounded-full px-3 py-1`}>
                        {getDifficultyBadge(course.difficulty).label}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {/* Lessons */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-1 mb-1">
                          <BookOpen className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Lessons</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{course.lessons}</p>
                      </div>

                      {/* Students */}
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Students</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{course.students}</p>
                      </div>

                      {/* Duration */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Duration</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{course.duration}</p>
                      </div>
                    </div>

                    {/* Completion Rate (only for active courses) */}
                    {course.status === 'active' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Completion Rate</span>
                          <span className="text-xs font-bold text-green-600 dark:text-green-400">
                            {course.completionRate}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => handleEdit(course.id)}
                          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <Button
                          onClick={() => handleDelete(course.id)}
                          variant="outline"
                          className="w-full rounded-xl border-2 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </motion.div>
                    </div>
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
                <div className="text-8xl mb-6">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first course'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="h-12 px-8 text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Course
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Add Course Modal */}
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
                      Create New Course
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
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Course Title
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Climate Change 101"
                        className="h-12 rounded-xl border-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Topic
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., Environmental Science"
                          className="h-12 rounded-xl border-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Difficulty
                        </label>
                        <Select>
                          <SelectTrigger className="h-12 rounded-xl border-2">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Number of Lessons
                        </label>
                        <Input
                          type="number"
                          placeholder="e.g., 12"
                          className="h-12 rounded-xl border-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Duration
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g., 6 weeks"
                          className="h-12 rounded-xl border-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Brief description of the course..."
                        className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:border-green-500 dark:focus:border-green-500 outline-none transition-colors"
                      />
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
                        <Plus className="mr-2 h-5 w-5" />
                        Create Course
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
