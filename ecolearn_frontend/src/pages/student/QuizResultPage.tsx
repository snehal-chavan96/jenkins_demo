import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Trophy,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Award,
  Target,
  Clock,
  RotateCcw,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { PageLoader } from '../../components/common/Loader';

export const QuizResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  if (!location.state) {
    navigate('/quizzes');
    return null;
  }
  const { quiz, questions, answers, score, passed, correctCount, totalQuestions } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) return <PageLoader />;
  if (!quiz) return null;

  const incorrectCount = (totalQuestions ?? questions.length) - correctCount;

  const percentage = score;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:py-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/quizzes')}
            className="rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Quizzes
          </Button>
        </div>

        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className={`border-4 ${passed
              ? 'border-green-300 dark:border-green-700'
              : 'border-red-300 dark:border-red-700'
            } rounded-3xl shadow-2xl bg-white dark:bg-gray-800`}>
            <CardContent className="p-8 sm:p-12 text-center">
              {/* Animated Trophy */}
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-8xl sm:text-9xl mb-6"
              >
                {passed ? '🏆' : score >= 50 ? '📚' : '💪'}
              </motion.div>

              {/* Result Title */}
              <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${passed
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
                }`}>
                {passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                {passed
                  ? 'You passed the quiz! Great job!'
                  : 'Don\'t give up! You can retake this quiz.'}
              </p>

              {/* Score Display */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl px-8 py-6 border-2 border-blue-200 dark:border-blue-700">
                  <Trophy className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Score</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {percentage}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Pass/Fail Badge */}
              <Badge className={`${passed
                  ? 'bg-green-500'
                  : 'bg-red-500'
                } text-white text-lg px-6 py-3 rounded-full mb-4`}>
                {passed ? (
                  <><CheckCircle className="mr-2 h-5 w-5" /> PASSED</>
                ) : (
                  <><XCircle className="mr-2 h-5 w-5" /> FAILED</>
                )}
              </Badge>

              <p className="text-gray-600 dark:text-gray-400">
                Passing score: {quiz.passingScore}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg mx-auto mb-3">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Correct Answers</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="border-2 border-red-200 dark:border-red-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-pink-600 text-white shadow-lg mx-auto mb-3">
                  <XCircle className="h-8 w-8" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Incorrect Answers</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{incorrectCount}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 text-white shadow-lg mx-auto mb-3">
                  <Target className="h-8 w-8" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalQuestions}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Answers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg bg-white dark:bg-gray-800 mb-8">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Review Your Answers
              </h2>

              <div className="space-y-6">
                {questions.map((question: any, index: number) => {
                  const userAnswer = answers[index]?.selectedOption;
                  const isCorrect = userAnswer === question.correctAnswer;
                  const wasAnswered = userAnswer !== null && userAnswer !== undefined;

                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + (index * 0.1) }}
                      className={`p-5 rounded-2xl border-2 ${!wasAnswered
                          ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/20'
                          : isCorrect
                            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                        }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-semibold">
                              Question {index + 1}
                            </Badge>
                            {!wasAnswered ? (
                              <Badge className="bg-gray-500 text-white">
                                Not Answered
                              </Badge>
                            ) : isCorrect ? (
                              <Badge className="bg-green-500 text-white flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Correct
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500 text-white flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Incorrect
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {question.text}
                          </h3>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {question.options.map((option: string, optionIndex: number) => {
                          const isUserAnswer = userAnswer === optionIndex;
                          const isCorrectAnswer = question.correctAnswer === optionIndex;
                          const optionLetter = String.fromCharCode(65 + optionIndex);

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-xl border-2 ${isCorrectAnswer
                                  ? 'border-green-400 dark:border-green-600 bg-green-100 dark:bg-green-900/30'
                                  : isUserAnswer && !isCorrect
                                    ? 'border-red-400 dark:border-red-600 bg-red-100 dark:bg-red-900/30'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold ${isCorrectAnswer
                                    ? 'bg-green-500 text-white'
                                    : isUserAnswer && !isCorrect
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                  }`}>
                                  {optionLetter}
                                </div>
                                <span className="flex-1 text-gray-800 dark:text-gray-200">
                                  {option}
                                </span>
                                {isCorrectAnswer && (
                                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="text-sm font-semibold">Correct Answer</span>
                                  </div>
                                )}
                                {isUserAnswer && !isCorrect && (
                                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                    <XCircle className="h-5 w-5" />
                                    <span className="text-sm font-semibold">Your Answer</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/quizzes')}
            variant="outline"
            className="h-14 px-8 rounded-xl border-2 text-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Quizzes
          </Button>

          {!passed && (
            <Button
              onClick={() => navigate('/take-quiz', { state: { quiz } })}
              className="h-14 px-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg text-lg"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Retake Quiz
            </Button>
          )}

          {passed && (
            <Button
              onClick={() => {
                // Share functionality
                console.log('Share result');
              }}
              className="h-14 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg text-lg"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share Achievement
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};
