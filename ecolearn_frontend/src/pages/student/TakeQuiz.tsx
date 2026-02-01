import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Flag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { PageLoader } from '../../components/common/Loader';

interface Question {
  id: string;
  text: string;
  imageUrl?: string; // new field for question image
  options: { text: string; imageUrl?: string }[]; // options can also have images
  correctAnswer: number;
}


interface Answer {
  questionId: string;
  selectedOption: number | null;
}

export const TakeQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quiz = location.state?.quiz;

  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sample questions (in production, fetch from backend based on quiz)
  const questions: Question[] = [
    {
      id: '1',
      text: 'What is the primary cause of climate change?',
      imageUrl: 'https://res.cloudinary.com/dbswpdqgh/image/upload/v1765011065/ecolearn/quiz/unyoiihysyjfr4phj79q.jpg',

      options: [
        { text: 'Natural climate cycles', imageUrl: undefined },
        { text: 'Greenhouse gas emissions from human activities', imageUrl: 'https://res.cloudinary.com/dbswpdqgh/image/upload/v1765012350/ecolearn/quiz/kjcx0qeepmtk4tozwnip.jpg' },
        { text: 'Solar radiation changes', imageUrl: undefined },
        { text: 'Volcanic eruptions', imageUrl: undefined }
      ],
      correctAnswer: 1
    },
    {
      id: '2',
      text: 'Which renewable energy source is most widely used globally?',
      imageUrl: undefined,
      options: [
        { text: 'Solar power', imageUrl: undefined },
        { text: 'Wind power', imageUrl: undefined },
        { text: 'Hydroelectric power', imageUrl: undefined },
        { text: 'Geothermal energy', imageUrl: undefined }
      ],
      correctAnswer: 2
    },
    {
      id: '3',
      text: 'What percentage of Earth\'s water is fresh water?',
      imageUrl: undefined,
      options: [
        { text: '10%', imageUrl: undefined },
        { text: '25%', imageUrl: undefined },
        { text: '3%', imageUrl: undefined },
        { text: '50%', imageUrl: undefined }
      ],
      correctAnswer: 2
    },
    {
      id: '4',
      text: 'Which gas is most responsible for the greenhouse effect?',
      imageUrl: undefined,
      options: [
        { text: 'Oxygen', imageUrl: undefined },
        { text: 'Nitrogen', imageUrl: undefined },
        { text: 'Carbon Dioxide', imageUrl: undefined },
        { text: 'Hydrogen', imageUrl: undefined }
      ],
      correctAnswer: 2
    },
    {
      id: '5',
      text: 'What is the main benefit of recycling?',
      imageUrl: undefined,
      options: [
        { text: 'It makes products cheaper', imageUrl: undefined },
        { text: 'It reduces waste and conserves resources', imageUrl: undefined },
        { text: 'It creates more jobs', imageUrl: undefined },
        { text: 'It increases production', imageUrl: undefined }
      ],
      correctAnswer: 1
    }
  ];

  useEffect(() => {
    if (!quiz) {
      navigate('/quizzes');
      return;
    }

    // Initialize answers
    const initialAnswers = questions.map(q => ({
      questionId: q.id,
      selectedOption: null
    }));
    setAnswers(initialAnswers);

    // Set timer (convert minutes to seconds)
    setTimeLeft(quiz.duration * 60);

    setTimeout(() => setIsLoading(false), 500);
  }, [quiz, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isLoading) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isLoading) {
      // Auto submit when time runs out
      handleSubmit();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isLoading]);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => prev.map(ans =>
      ans.questionId === questionId
        ? { ...ans, selectedOption: optionIndex }
        : ans
    ));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((question, index) => {
      const answer = answers[index];
      if (answer.selectedOption === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Navigate to result page with data
    navigate('/quiz-result', {
      state: {
        quiz,
        questions,
        answers,
        score,
        passed,
        correctCount,
        totalQuestions: questions.length
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / (quiz?.duration * 60)) * 100;
    if (percentage > 50) return 'text-green-600 dark:text-green-400 border-green-300 dark:border-green-700';
    if (percentage > 25) return 'text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
    return 'text-red-600 dark:text-red-400 border-red-300 dark:border-red-700';
  };

  const answeredCount = answers.filter(a => a.selectedOption !== null).length;
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  if (isLoading || !quiz) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-2 border-green-200 dark:border-green-700 rounded-3xl shadow-2xl bg-white dark:bg-gray-800">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Quiz Info */}
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{quiz.icon}</div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {quiz.name}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.course}
                    </p>
                  </div>
                </div>

                {/* Timer and Progress */}
                <div className="flex items-center gap-4">
                  {/* Timer */}
                  <Card className={`border-2 ${getTimeColor()} rounded-2xl shadow-lg`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <Clock className={`h-5 w-5 ${getTimeColor()}`} />
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Time Left</p>
                          <p className={`text-xl sm:text-2xl font-bold ${getTimeColor()}`}>
                            {formatTime(timeLeft)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress */}
                  <Card className="border-2 border-blue-300 dark:border-blue-700 rounded-2xl shadow-lg">
                    <CardContent className="p-3 sm:p-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Progress</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {answeredCount}/{questions.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator - Left Side */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800 sticky top-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Questions
                </h3>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2 max-h-[500px] overflow-y-auto">
                  {questions.map((_, index) => {
                    const isAnswered = answers[index]?.selectedOption !== null;
                    const isCurrent = index === currentQuestionIndex;
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleQuestionJump(index)}
                        className={`h-12 w-12 rounded-xl font-semibold transition-all ${isCurrent
                          ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg scale-110'
                          : isAnswered
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700'
                          } hover:scale-105`}
                        whileHover={{ scale: isCurrent ? 1.1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {index + 1}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gradient-to-r from-green-500 to-blue-600" />
                    <span className="text-gray-600 dark:text-gray-400">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700" />
                    <span className="text-gray-600 dark:text-gray-400">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700" />
                    <span className="text-gray-600 dark:text-gray-400">Unanswered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Display - Right Side */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                  <CardContent className="p-6 sm:p-8">
                    {/* Question Header */}
                    <div className="mb-6">
                      <Badge className="bg-blue-500 text-white rounded-full px-4 py-1 mb-4">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </Badge>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentQuestion.text}
                      </h2>
                      {currentQuestion.imageUrl && (
                        <div className="my-4 flex justify-center">
                          <img
                            src={currentQuestion.imageUrl}
                            alt="Question Image"
                            className="w-full max-w-lg h-auto object-contain mx-auto rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-8">
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = currentAnswer?.selectedOption === index;
                        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${isSelected
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                              }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${isSelected
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}>
                                {optionLetter}
                              </div>

                              <div className="flex-1 flex flex-col">
                                <span className={`${isSelected
                                  ? 'text-gray-900 dark:text-white font-semibold'
                                  : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                  {option.text}
                                </span>

                                {option.imageUrl && (
                                  <div className="mt-2 flex justify-start">
                                    <img
                                      src={option.imageUrl}
                                      alt={`Option ${optionLetter}`}
                                      className="w-full max-w-lg h-auto object-contain mx-auto rounded-lg"
                                    />
                                  </div>
                                )}

                              </div>

                              {isSelected && <CheckCircle className="h-6 w-6 text-green-500" />}
                            </div>
                          </motion.button>
                        );
                      })}

                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between gap-4">
                      <Button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-2"
                      >
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Previous
                      </Button>

                      {currentQuestionIndex === questions.length - 1 ? (
                        <Button
                          onClick={() => setShowSubmitConfirm(true)}
                          className="h-12 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
                        >
                          <Flag className="mr-2 h-5 w-5" />
                          Submit Quiz
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNext}
                          className="h-12 px-6 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg"
                        >
                          Next
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <Card className="border-2 border-yellow-200 dark:border-yellow-700 rounded-3xl shadow-2xl bg-white dark:bg-gray-800">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">
                    {answeredCount === questions.length ? '✅' : '⚠️'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Submit Quiz?
                  </h3>

                  {answeredCount < questions.length && (
                    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-200 dark:border-yellow-700">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                          <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                            Unanswered Questions
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            You have {questions.length - answeredCount} unanswered question(s).
                            These will be marked as incorrect.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You answered <span className="font-bold text-green-600 dark:text-green-400">{answeredCount}</span> out of {questions.length} questions.
                    <br />
                    Are you sure you want to submit?
                  </p>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowSubmitConfirm(false)}
                      className="flex-1 h-12 rounded-xl border-2"
                    >
                      Review Answers
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                    >
                      Yes, Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
