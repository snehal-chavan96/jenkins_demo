import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  Search,
  Edit,
  Trash2,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Filter,
  Download,
  Copy,
  Eye,
  Calendar,
  BookOpen,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { quizAPI } from '../../services/quizAPI';
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

interface Quiz {
  id: string;
  title: string;           // Quiz title
  class: string;           // Class/Course name
  questions: Question[];   // All questions
  totalQuestions: number;  // Total number of questions
  duration: number;        // Duration in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  passingScore: number;
  status: 'active' | 'draft';
  createdDate: string;
  color?: string;
  icon?: string;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}


export const QuizManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Redirect if not a teacher
  useEffect(() => {
    if (user && user.role !== 'teacher') {
      navigate('/dashboard');
    }
  }, [user, navigate]);


  const [quizzes, setQuizzes] = useState<Quiz[]>([]);


useEffect(() => {
  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const data = await quizAPI.getAllQuizzes();
      // Map backend data to your Quiz type if needed
      const mappedQuizzes: Quiz[] = data.map((quiz: any) => ({
        id: quiz.id.toString(),
        title: quiz.title,
        class: quiz.description || "General",
        questions: quiz.questions?.map((q: any) => ({
          id: q.id.toString(),
          text: q.questionText,
          options: q.options?.map((o: any) => o.optionText) || [],
          correctAnswer: q.options?.findIndex((o: any) => o.correct) ?? 0
        })) || [],
        totalQuestions: quiz.totalQuestions || (quiz.questions?.length ?? 0),
        duration: quiz.timeLimitMinutes || 30,
        difficulty: quiz.questions?.[0]?.difficultyLevel?.toLowerCase() || "easy",
        passingScore: quiz.passingScore || 70,
        status: quiz.active ? 'active' : 'draft',
        createdDate: new Date(quiz.createdAt).toLocaleDateString(),
        color: 'from-green-400 to-emerald-600', // optional: can map based on difficulty
        icon: '📝' // optional
      }));
      setQuizzes(mappedQuizzes);
    } catch (error) {
      console.error("Failed to fetch quizzes", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchQuizzes();
}, []);


  // Get unique courses for filter
  const courses = ['all', ...Array.from(new Set(quizzes.map(q => q.class)))];

  // Filter quizzes
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.class.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = filterCourse === 'all' || quiz.class === filterCourse;
    const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusBadge = (status: Quiz['status']) => {
    switch (status) {
      case 'active': return { label: 'Active', color: 'bg-green-500',icon: CheckCircle  };
      case 'draft': return { label: 'Draft', color: 'bg-orange-500',icon: AlertCircle  };
    }
  };

  const getDifficultyBadge = (difficulty: Quiz['difficulty']) => {
    switch (difficulty) {
      case 'easy': return { label: 'Easy', color: 'bg-green-500' };
      case 'medium': return { label: 'Medium', color: 'bg-yellow-500' };
      case 'hard': return { label: 'Hard', color: 'bg-red-500' };
    }
  };

  const handleEdit = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
      navigate('/create-edit-quiz', { state: { quiz } });
    }
  };

  const handleDelete = (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    }
  };

  const handleDuplicate = (quizId: string) => {
    const quizToDuplicate = quizzes.find(q => q.id === quizId);
    if (quizToDuplicate) {
      const newQuiz = {
        ...quizToDuplicate,
        id: `${Date.now()}`,
        name: `${quizToDuplicate.title} (Copy)`,
        status: 'draft' as const,
        totalAttempts: 0,
        avgScore: 0
      };
      setQuizzes([...quizzes, newQuiz]);
    }
  };

  const handleViewResults = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
      navigate('/quiz-results', { state: { quiz } });
    }
  };

  if (isLoading) return <PageLoader />;

  // Calculate stats
  const totalQuizzes = quizzes.length;
  const activeQuizzes = quizzes.filter(q => q.status === 'active').length;
  const totalQuestions = quizzes.reduce((sum, q) => sum + q.totalQuestions, 0);

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
                <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Quiz Management
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                Create and manage assessments for your courses
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                onClick={() => navigate('/create-edit-quiz')}
                className="w-full sm:w-auto h-12 sm:h-14 text-base sm:text-lg rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Quiz
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Quizzes</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalQuizzes}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
                      <ClipboardList className="h-6 w-6" />
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Quizzes</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeQuizzes}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 text-white shadow-lg">
                      <CheckCircle className="h-6 w-6" />
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

            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >

            </motion.div>
          </div>

          {/* Search and Filter Bar */}
          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search quizzes by name or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 transition-colors"
                  />
                </div>

                {/* Course Filter */}
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="w-full lg:w-56 h-12 rounded-xl border-2">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course} value={course}>
                        {course === 'all' ? 'All Courses' : course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full lg:w-48 h-12 rounded-xl border-2">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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

        {/* Quizzes Grid */}
        {filteredQuizzes.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz, index) => {
              const statusBadge = getStatusBadge(quiz.status);
              const difficultyBadge = getDifficultyBadge(quiz.difficulty);
              const StatusIcon = statusBadge.icon;

              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className={`border-3 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all bg-white dark:bg-gray-800 ${quiz.status === 'active' ? 'border-green-300 dark:border-green-600 ring-2 ring-green-200 dark:ring-green-800' :
                      quiz.status === 'draft' ? 'border-blue-300 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-800' :
                        'border-green-200 dark:border-green-700'
                    }`}>
                    {/* Card Header with Gradient */}
                    <div className={`h-32 bg-gradient-to-br ${quiz.color} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10" />

                      {/* Icon */}
                      <div className="absolute top-4 left-4">
                        <div className="text-6xl">{quiz.icon}</div>
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
                              onClick={() => handleEdit(quiz.id)}
                              className="cursor-pointer rounded-lg"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Quiz
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(quiz.id)}
                              className="cursor-pointer rounded-lg"
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleViewResults(quiz.id)}
                              className="cursor-pointer rounded-lg"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Results
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(quiz.id)}
                              className="cursor-pointer rounded-lg text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Quiz
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <Badge className={`${statusBadge.color} text-white rounded-full px-3 py-1 flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Quiz Name */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {quiz.title}
                      </h3>

                      {/* Course */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {quiz.class}
                      </p>

                      {/* Difficulty Badge */}
                      <div className="mb-4">
                        <Badge className={`${difficultyBadge.color} text-white rounded-full px-3 py-1`}>
                          {difficultyBadge.label}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* Questions */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-1 mb-1">
                            <ClipboardList className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Questions</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{quiz.questions.length}</p>
                        </div>

                        {/* Duration */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Duration</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{quiz.duration}m</p>
                        </div>


                        {/* Passing Score */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Passing Score</span>
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">
                              {quiz.passingScore}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
                              style={{ width: `${quiz.passingScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                            <Button
                              onClick={() => handleEdit(quiz.id)}
                              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                            <Button
                              onClick={() => handleDelete(quiz.id)}
                              variant="outline"
                              className="w-full rounded-xl border-2 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </motion.div>
                        </div>
                        </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl bg-white dark:bg-gray-800">
              <CardContent className="p-12">
                <div className="text-8xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No quizzes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first quiz'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => navigate('/create-edit-quiz')}
                    className="h-12 px-8 text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
