import { apiCall } from "./api";

// Chatbot API integration using existing apiCall helper
export const chatbotAPI = {
  ask: async (question: string) => {
    try {
      const data = await apiCall("/chatbot/ask", {
        method: "POST",
        body: JSON.stringify({ question }),
      });
      // assuming backend returns { answer: string }
      return data.answer;
    } catch (err) {
      console.error("Chatbot API call failed:", err);
      throw new Error("Failed to get answer from chatbot");
    }
  },
};
