import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Trash2,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { mediaAPI } from "../../services/api";
import { quizAPI } from "../../services/quizAPI";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { PageLoader } from "../../components/common/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  optionImages?: [string?, string?, string?, string?]; // optional images for each option
  correctAnswer: 0 | 1 | 2 | 3;
  questionImageUrl?: string; // main question image
}

interface QuizFormData {
  title: string;
  class: string;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  passingScore: number;
  questions: Question[];
}

export const CreateEditQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Editing existing quiz
  const editingQuiz = location.state?.quiz;
  const isEditing = !!editingQuiz;

  console.log("Editing quiz questions:", editingQuiz?.questions);
  
  console.log("RAW backend question:", editingQuiz?.questions?.[0]);

  // Available classes
  const classes = [
    "Climate Change 101",
    "Sustainable Living",
    "Renewable Energy Basics",
    "Ocean Conservation",
    "Urban Gardening",
    "Waste Management",
  ];


// Form state with normalized fields
const [formData, setFormData] = useState<QuizFormData>({
  title: editingQuiz?.title || "",
  class: editingQuiz?.class || "",
  difficulty: editingQuiz?.difficulty || "easy",
  duration: editingQuiz?.duration || 30,
  passingScore: editingQuiz?.passingScore || 70,
  questions: editingQuiz?.questions?.map((q: any) => ({
    id: q.id,
    text: q.text,
    options: q.options as [string, string, string, string],
    correctAnswer: q.correctAnswer as 0 | 1 | 2 | 3,
    questionImageUrl: q.questionImageUrl || "https://res.cloudinary.com/dbswpdqgh/image/upload/v1762961393/doubtly_images/jhkx1ahqqq9u8ulnjidc.jpg",      // optional
    optionImages: q.options.map((opt: any) => opt.optionImageUrl) as [string?, string?, string?, string?],
  })) || [{ id: `q-${Date.now()}`, text: "", options: ["", "", "", ""], correctAnswer: 0 }],
});


  // Redirect if not teacher
  useEffect(() => {
    if (user && user.role !== "teacher") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleInputChange = (field: keyof QuizFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionTextChange = (questionId: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, text } : q
      ),
    }));
  };

  const handleOptionChange = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options] as [string, string, string, string];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    }));
  };

  const handleCorrectAnswerChange = (
    questionId: string,
    answerIndex: 0 | 1 | 2 | 3
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, correctAnswer: answerIndex } : q
      ),
    }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const deleteQuestion = (questionId: string) => {
    if (formData.questions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== questionId),
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.title.trim()) newErrors.push("Quiz title is required");
    if (!formData.class) newErrors.push("Please select a class");
    if (formData.duration < 5)
      newErrors.push("Duration must be at least 5 minutes");
    if (formData.passingScore < 0 || formData.passingScore > 100)
      newErrors.push("Passing score must be between 0 and 100");
    if (formData.questions.length === 0)
      newErrors.push("At least one question is required");

    formData.questions.forEach((q, index) => {
      if (!q.text.trim())
        newErrors.push(`Question ${index + 1}: Question text is required`);
      if (q.options.some((opt) => !opt.trim()))
        newErrors.push(`Question ${index + 1}: All options must be filled`);
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
  if (!validateForm()) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  setIsSaving(true);
  try {
    const payload = {
      id: editingQuiz?.id, // Include quiz ID for updates
      title: formData.title,
      description: "", // optional
      totalQuestions: formData.questions.length,
      timeLimitMinutes: formData.duration,
      passingScore: formData.passingScore,
      maxAttempts: 1,
      active: true,
      questions: formData.questions.map((q, idx) => ({
        id: q.id?.startsWith("q-") ? null : q.id, // send null for new questions, existing IDs for update
        questionText: q.text,
        questionImageUrl: q.questionImageUrl || null,
        points: 1,
        displayOrder: idx + 1,
        difficultyLevel: formData.difficulty.toUpperCase(),
        questionType: "MCQ",
        options: q.options.map((opt, optIdx) => ({
          id: q.optionImages?.[optIdx]?.startsWith("opt-") ? null : undefined, // optional: handle option IDs if you track them
          optionText: opt,
          optionImageUrl: q.optionImages?.[optIdx] || null,
          correct: q.correctAnswer === optIdx,
          displayOrder: optIdx + 1,
        })),
      })),
    };

    let savedQuiz;
    if (isEditing && editingQuiz?.id) {
      savedQuiz = await quizAPI.updateQuiz(editingQuiz.id, payload);
    } else {
      savedQuiz = await quizAPI.createQuiz(payload);
    }

    navigate("/quiz-management");
  } catch (err) {
    console.error("Quiz save failed:", err);
    alert("Failed to save quiz. Please try again.");
  } finally {
    setIsSaving(false);
  }
};


  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
      )
    ) {
      navigate("/quiz-management");
    }
  };

  const handleImageUpload = async (questionId: string, file?: File) => {
    if (!file) return;
    try {
      const { secure_url } = await mediaAPI.uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId ? { ...q, questionImageUrl: secure_url } : q
        ),
      }));
    } catch (err) {
      console.error("Question image upload failed:", err);
      alert("Question image upload failed. Try again.");
    }
  };

  const handleOptionImageUpload = async (
    questionId: string,
    optionIndex: number,
    file?: File
  ) => {
    if (!file) return;
    try {
      const { secure_url } = await mediaAPI.uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id === questionId) {
            const newOptionImages = q.optionImages
              ? [...q.optionImages]
              : [undefined, undefined, undefined, undefined];

            newOptionImages[optionIndex] = secure_url;

            return {
              ...q,
              optionImages: newOptionImages as [
                string?,
                string?,
                string?,
                string?
              ],
            };
          }
          return q;
        }),
      }));
    } catch (err) {
      console.error("Option image upload failed:", err);
      alert("Option image upload failed. Try again.");
    }
  };


  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:py-8 lg:px-8 pb-32">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-8 w-8 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
              {isEditing ? "Edit Quiz" : "Create Quiz"}
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {isEditing
              ? "Update quiz details and questions"
              : "Design a new quiz for your students"}
          </p>
        </motion.div>

        {/* Error Messages */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Card className="border-2 border-red-300 dark:border-red-700 rounded-2xl shadow-lg bg-red-50 dark:bg-red-900/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                        Please fix the following errors:
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => setErrors([])}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiz Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-2 border-green-200 dark:border-green-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Quiz Details
              </h2>

              <div className="space-y-6">
                {/* Quiz Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Quiz Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Climate Change Fundamentals"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="h-12 rounded-xl border-2"
                  />
                </div>

                {/* Select Class */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.class}
                    onValueChange={(value) => handleInputChange("class", value)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty, Duration, Passing Score */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value: any) =>
                        handleInputChange("difficulty", value)
                      }
                    >
                      <SelectTrigger className="h-12 rounded-xl border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 text-white">
                              Easy
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-500 text-white">
                              Medium
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="hard">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-500 text-white">
                              Hard
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="5"
                      max="180"
                      placeholder="30"
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange(
                          "duration",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="h-12 rounded-xl border-2"
                    />
                  </div>

                  {/* Passing Score */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Passing Score (%) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="70"
                      value={formData.passingScore}
                      onChange={(e) =>
                        handleInputChange(
                          "passingScore",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="h-12 rounded-xl border-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">❓</span>
                  Questions ({formData.questions.length})
                </h2>
                <Badge className="bg-blue-500 text-white rounded-full px-4 py-2">
                  Total: {formData.questions.length}
                </Badge>
              </div>

              <div className="space-y-6">
                {formData.questions.map((question, questionIndex) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative"
                  >
                    <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
                      <CardContent className="p-5">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Question {questionIndex + 1}
                          </h3>
                          {formData.questions.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteQuestion(question.id)}
                              className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* Question Text + Image */}
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Question Text <span className="text-red-500">*</span>
                          </label>

                          {/* Text Input */}
                          <Input
                            type="text"
                            placeholder="Enter your question here"
                            value={question.text}
                            onChange={(e) =>
                              handleQuestionTextChange(question.id, e.target.value)
                            }
                            className="h-12 rounded-lg border-2 mb-2"
                          />

                          {/* Upload Image */}
                          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-500 text-green-500 text-sm hover:bg-green-50 transition-all">
                            <span>🖼 Upload Question Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(question.id, e.target.files?.[0])}
                              className="hidden"
                            />
                          </label>

                          {/* Display uploaded image in a responsive container */}
                          {question.questionImageUrl && (
                            <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              <img
                                src={question.questionImageUrl}
                                alt={`Question ${questionIndex + 1}`}
                                className="w-full sm:w-32 h-32 object-cover rounded-md border shadow-sm"
                              />
                              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                                Uploaded image preview
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Answer Options <span className="text-red-500">*</span>
                          </label>

                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
                            >
                              {/* Radio Button */}
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() =>
                                  handleCorrectAnswerChange(question.id, optionIndex as 0 | 1 | 2 | 3)
                                }
                                className="h-5 w-5 text-green-600 focus:ring-green-500 cursor-pointer"
                              />

                              {/* Option Label */}
                              <Badge
                                variant="outline"
                                className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                              >
                                {String.fromCharCode(65 + optionIndex)}
                              </Badge>

                              {/* Option Input */}
                              <Input
                                type="text"
                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                value={option}
                                onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                className={`flex-1 h-10 rounded-lg border-2 ${question.correctAnswer === optionIndex
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : ""
                                  }`}
                              />

                              {/* Option Image Upload & Preview */}
                              <div className="flex flex-col items-start sm:items-center mt-2 sm:mt-0">
                                {question.optionImages?.[optionIndex] && (
                                  <img
                                    src={question.optionImages[optionIndex]}
                                    alt={`Option ${optionIndex + 1}`}
                                    className="w-full sm:w-20 h-20 object-cover rounded-md border mb-1"
                                  />
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleOptionImageUpload(question.id, optionIndex, e.target.files?.[0])
                                  }
                                  className="text-sm cursor-pointer"
                                  title="Upload image for this option"
                                />
                              </div>
                            </div>
                          ))}

                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            💡 Select the radio button to mark the correct answer
                          </p>
                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Add Question Button */}
              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={addQuestion}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg text-lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Question
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sticky Footer */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-2 border-green-200 dark:border-green-700 shadow-2xl z-40"
      >
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex gap-4 items-center justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="h-12 px-8 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-lg"
            >
              <X className="mr-2 h-5 w-5" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg text-lg"
            >
              {isSaving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <ClipboardList className="h-5 w-5" />
                  </motion.div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
