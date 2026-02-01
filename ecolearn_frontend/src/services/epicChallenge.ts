import { apiCall } from "./api";

export const epicChallengeAPI = {
  submit: async (data: {
    studentId: number;
    challengeTitle: string;
    ecoPoints: number;
    description?: string;
    imageUrl?: string;
  }) => {
    return apiCall("/epic-challenges/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getPending: async () => {
    return apiCall("/epic-challenges/pending");
  },

  review: async (
    submissionId: number,
    payload: {
      teacherId: number;
      approved: boolean;
      remarks?: string;
    }
  ) => {
    return apiCall(`/epic-challenges/review/${submissionId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMySubmissions: async (studentId: number) => {
    return apiCall(`/epic-challenges/student/${studentId}`);
  },
};
