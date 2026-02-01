import { apiCall } from "./api"; // reuse your existing apiCall helper

export const quizAPI = {
  createQuiz: async (quizData: any) => {
    return await apiCall("/quizzes", {
      method: "POST",
      body: JSON.stringify(quizData),
    });
  },

  updateQuiz: async (quizId: string, quizData: any) => {
    return await apiCall(`/quizzes/${quizId}`, {
      method: "PUT",
      body: JSON.stringify(quizData),
    });
  },

  getQuizById: async (quizId: string) => {
    return await apiCall(`/quizzes/${quizId}`, {
      method: "GET",
    });
  },

  getAllQuizzes: async () => {
    return await apiCall("/quizzes", {
      method: "GET",
    });
  },
};
