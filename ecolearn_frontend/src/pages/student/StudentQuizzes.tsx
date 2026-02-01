import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { quizAPI } from "../../services/quizAPI"; 
import { 
  ClipboardList, Search, Clock, CheckCircle, Calendar,
  BookOpen, Target, Trophy, Play, Award, TrendingUp
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { PageLoader } from "../../components/common/Loader";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../../components/ui/select";

interface Quiz {
  id: string;
  name: string;
  course: string;
  questions: number;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  status: "available" | "upcoming" | "completed";
  dueDate?: string;
  passingScore: number;
  color: string;
  icon: string;
  attempted?: boolean;
  score?: number;
  attemptDate?: string;
  passed?: boolean;
}

export const StudentQuizzes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizAPI.getAllQuizzes();

        const mappedQuizzes: Quiz[] = data.map((quizDTO: any) => {
          const attempted = quizDTO.studentAttempts?.length > 0;
          const score = attempted ? quizDTO.studentAttempts[0].score : undefined;
          const passed = attempted && score !== undefined ? score >= quizDTO.passingScore : undefined;
          const attemptDate = attempted ? quizDTO.studentAttempts[0].attemptDate : undefined;

          return {
            id: quizDTO.id.toString(),
            name: quizDTO.title,
            course: `Chapter ${quizDTO.chapterId}`,
            questions: quizDTO.totalQuestions,
            duration: quizDTO.timeLimitMinutes || 30,
            difficulty: (quizDTO.questions?.[0]?.difficultyLevel?.toLowerCase() as "easy" | "medium" | "hard") || "easy",
            status: attempted ? "completed" : (quizDTO.active ? "available" : "upcoming"),
            passingScore: quizDTO.passingScore || 70,
            color: "from-green-400 to-emerald-600",
            icon: "📝",
            attempted,
            score,
            passed,
            attemptDate,
          };
        });

        setQuizzes(mappedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = filterCourse === "all" || quiz.course === filterCourse;
    const matchesStatus = filterStatus === "all" || quiz.status === filterStatus;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const totalQuizzes = quizzes.length;
  const completedQuizzes = quizzes.filter((q) => q.attempted).length;
  const averageScore =
    quizzes.filter((q) => q.score !== undefined).reduce((acc, q) => acc + (q.score || 0), 0) /
    (quizzes.filter((q) => q.score !== undefined).length || 1);
  const passedQuizzes = quizzes.filter((q) => q.passed).length;

  const handleStartQuiz = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) navigate("/take-quiz", { state: { quiz } });
  };

  const handleViewResults = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) navigate("/quiz-result", { state: { quiz } });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:py-8 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-8 w-8 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              My Quizzes
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Test your knowledge and track your progress! 📚
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Quizzes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ scale: 1.05, y: -5 }}>
            <Card className="border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Quizzes</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalQuizzes}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 text-white shadow-lg">
                  <ClipboardList className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Completed Quizzes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} whileHover={{ scale: 1.05, y: -5 }}>
            <Card className="border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedQuizzes}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Average Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} whileHover={{ scale: 1.05, y: -5 }}>
            <Card className="border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Score</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(averageScore)}%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-600 text-white shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Passed Quizzes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} whileHover={{ scale: 1.05, y: -5 }}>
            <Card className="border-2 border-purple-200 dark:border-purple-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-4 sm:p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Passed</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{passedQuizzes}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 text-white shadow-lg">
                  <Trophy className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mb-6">
          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search quizzes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2"
                  />
                </div>

                {/* Status Filter */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quiz Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((quiz, index) => (
            <motion.div key={quiz.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * index }} whileHover={{ y: -8 }}>
              <Card className={`border-2 ${quiz.status === 'completed' ? 'border-gray-300 dark:border-gray-600' : 'border-green-200 dark:border-green-700'} rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 h-full flex flex-col justify-between`}>
                {/* Header gradient */}
                <div className={`h-3 bg-gradient-to-r ${quiz.color}`} />

                <CardContent className="p-6 flex flex-col justify-between flex-1">
                  {/* Icon & Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{quiz.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
                          {quiz.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.course}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quiz Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <BookOpen className="h-4 w-4" />
                        <span>{quiz.questions} Questions</span>
                      </div>
                      <Badge className={`${getDifficultyColor(quiz.difficulty)} text-white rounded-full px-3`}>
                        {quiz.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Target className="h-4 w-4" />
                        <span>{quiz.passingScore}% to pass</span>
                      </div>
                    </div>

                    {quiz.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {quiz.dueDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Score / Status */}
                  {quiz.attempted && quiz.score !== undefined ? (
                    <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Score</p>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{quiz.score}%</p>
                        </div>
                        <div>
                          {quiz.passed ? (
                            <Badge className="bg-green-500 text-white rounded-full px-3 py-1 flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              Passed
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500 text-white rounded-full px-3 py-1">Failed</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Attempted: {quiz.attemptDate}
                      </p>
                    </div>
                  ) : null}

                  {/* Action Buttons */}
                  {quiz.status === 'available' && !quiz.attempted ? (
                    <Button onClick={() => handleStartQuiz(quiz.id)} className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg">
                      <Play className="mr-2 h-5 w-5" />
                      Start Quiz
                    </Button>
                  ) : quiz.status === 'completed' && quiz.attempted ? (
                    <Button onClick={() => handleViewResults(quiz.id)} variant="outline" className="w-full h-12 rounded-xl border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Trophy className="mr-2 h-5 w-5" />
                      View Results
                    </Button>
                  ) : quiz.status === 'upcoming' ? (
                    <Button disabled className="w-full h-12 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                      <Calendar className="mr-2 h-5 w-5" />
                      Upcoming
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-12 text-gray-600 dark:text-gray-400">
            No quizzes found 😕
          </motion.div>
        )}
      </div>
    </div>
  );
};
