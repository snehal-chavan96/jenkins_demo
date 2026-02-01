// src/types/quiz.ts

export interface QuestionOptionDTO {
  id?: number; // optional for new questions
  optionText: string;
  optionImageUrl?: string;
  displayOrder?: number;
  correct: boolean;
}

export interface QuizQuestionDTO {
  id?: number; // optional for new questions
  questionText: string;
  questionImageUrl?: string;
  questionType?: "SINGLE_CHOICE" | "MULTIPLE_CHOICE"; // optional, default SINGLE_CHOICE
  difficultyLevel?: "EASY" | "MEDIUM" | "HARD";
  points?: number;
  displayOrder?: number;
  options: QuestionOptionDTO[];
}

export interface QuizDTO {
  id?: number; // optional for new quizzes
  title: string;
  description?: string; // used for 'class' if needed
  totalQuestions?: number;
  passingScore?: number;
  timeLimitMinutes?: number;
  maxAttempts?: number;
  active?: boolean;
  questions: QuizQuestionDTO[];
}
