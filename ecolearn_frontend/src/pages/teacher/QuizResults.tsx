import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ClipboardList, 
  Trophy,
  Clock,
  Target,
  Users,
  Eye,
  Download,
  ArrowLeft,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { PageLoader } from '../../components/common/Loader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

interface StudentResult {
  id: string;
  studentName: string;
  studentAvatar: string;
  score: number;
  status: 'passed' | 'failed';
  timeTaken: number; // in minutes
  attemptDate: string;
  correctAnswers: number;
  totalQuestions: number;
}

export const QuizResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [filterClass, setFilterClass] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  const quiz = location.state?.quiz;

  // Redirect if not a teacher or no quiz data
  useEffect(() => {
    if (user && user.role !== 'teacher') {
      navigate('/dashboard');
    }
    if (!quiz) {
      navigate('/quiz-management');
    }
  }, [user, navigate, quiz]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Sample student results
  const [results, setResults] = useState<StudentResult[]>([
    {
      id: '1',
      studentName: 'Sarah Chen',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      score: 95,
      status: 'passed',
      timeTaken: 22,
      attemptDate: 'Nov 10, 2024',
      correctAnswers: 19,
      totalQuestions: 20
    },
    {
      id: '2',
      studentName: 'Michael Torres',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      score: 88,
      status: 'passed',
      timeTaken: 25,
      attemptDate: 'Nov 10, 2024',
      correctAnswers: 18,
      totalQuestions: 20
    },
    {
      id: '3',
      studentName: 'Emma Wilson',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      score: 82,
      status: 'passed',
      timeTaken: 28,
      attemptDate: 'Nov 9, 2024',
      correctAnswers: 16,
      totalQuestions: 20
    },
    {
      id: '4',
      studentName: 'David Kim',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      score: 75,
      status: 'passed',
      timeTaken: 27,
      attemptDate: 'Nov 9, 2024',
      correctAnswers: 15,
      totalQuestions: 20
    },
    {
      id: '5',
      studentName: 'Sophia Martinez',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
      score: 68,
      status: 'failed',
      timeTaken: 30,
      attemptDate: 'Nov 8, 2024',
      correctAnswers: 14,
      totalQuestions: 20
    },
    {
      id: '6',
      studentName: 'James Anderson',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      score: 62,
      status: 'failed',
      timeTaken: 29,
      attemptDate: 'Nov 8, 2024',
      correctAnswers: 12,
      totalQuestions: 20
    },
  ]);

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'time':
        return a.timeTaken - b.timeTaken;
      case 'name':
        return a.studentName.localeCompare(b.studentName);
      case 'date':
        return new Date(b.attemptDate).getTime() - new Date(a.attemptDate).getTime();
      default:
        return 0;
    }
  });

  const handleViewResponse = (studentId: string) => {
    console.log('View response for student:', studentId);
    // Navigate to detailed response view
  };

  if (isLoading) return <PageLoader />;
  if (!quiz) return null;

  // Calculate statistics
  const totalAttempts = results.length;
  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  const passRate = Math.round((passedCount / totalAttempts) * 100);
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalAttempts);
  const avgTime = Math.round(results.reduce((sum, r) => sum + r.timeTaken, 0) / totalAttempts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:py-8 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/quiz-management')}
            className="rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Quiz Management
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              Quiz Results
            </h1>
          </div>

          {/* Quiz Info Card */}
          <Card className="border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Quiz Title</p>
                  <p className="font-bold text-gray-900 dark:text-white">{quiz.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Class</p>
                  <p className="font-bold text-gray-900 dark:text-white">{quiz.course}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Questions</p>
                  <p className="font-bold text-gray-900 dark:text-white">{quiz.questions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Passing Score</p>
                  <p className="font-bold text-gray-900 dark:text-white">{quiz.passingScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Attempts</p>
                  <p className="font-bold text-gray-900 dark:text-white">{totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Passed</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{passedCount}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{passRate}% pass rate</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
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
            <Card className="border-2 border-red-200 dark:border-red-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Failed</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{failedCount}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{100 - passRate}% fail rate</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-pink-600 text-white shadow-lg">
                    <XCircle className="h-6 w-6" />
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
            <Card className="border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Score</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgScore}%</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Class average</p>
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
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="border-2 border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Time</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgTime}m</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Average duration</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 text-white shadow-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-6"
        >
          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-2">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Sort by Score</SelectItem>
                      <SelectItem value="time">Sort by Time Taken</SelectItem>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="date">Sort by Attempt Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Export Button */}
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
            <CardContent className="p-0">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Rank</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Student Name</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Score</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Time Taken</th>
                      <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Attempt Date</th>
                      <th className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResults.map((result, index) => (
                      <motion.tr
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                      >
                        <td className="p-4">
                          {index < 3 ? (
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${
                              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                              'bg-gradient-to-br from-orange-300 to-orange-500'
                            }`}>
                              {index + 1}
                            </div>
                          ) : (
                            <div className="text-gray-600 dark:text-gray-400 font-semibold ml-2">
                              {index + 1}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={result.studentAvatar}
                              alt={result.studentName}
                              className="h-10 w-10 rounded-full border-2 border-green-300 dark:border-green-700"
                            />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {result.studentName}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {result.score}%
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({result.correctAnswers}/{result.totalQuestions})
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${
                            result.status === 'passed' 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          } text-white rounded-full px-3 py-1 flex items-center gap-1 w-fit`}>
                            {result.status === 'passed' ? (
                              <><CheckCircle className="h-3 w-3" /> Passed</>
                            ) : (
                              <><XCircle className="h-3 w-3" /> Failed</>
                            )}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                            <Clock className="h-4 w-4" />
                            <span>{result.timeTaken} min</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700 dark:text-gray-300">
                          {result.attemptDate}
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            onClick={() => handleViewResponse(result.id)}
                            size="sm"
                            className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Response
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {sortedResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {index < 3 && (
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-white ${
                                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                'bg-gradient-to-br from-orange-300 to-orange-500'
                              }`}>
                                {index + 1}
                              </div>
                            )}
                            <img
                              src={result.studentAvatar}
                              alt={result.studentName}
                              className="h-12 w-12 rounded-full border-2 border-green-300 dark:border-green-700"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {result.studentName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {result.attemptDate}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${
                            result.status === 'passed' 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          } text-white rounded-full px-3 py-1`}>
                            {result.status === 'passed' ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Score</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {result.score}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {result.timeTaken}m
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleViewResponse(result.id)}
                          size="sm"
                          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Response
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
