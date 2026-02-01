import { apiCall } from "./api";

export const ecopointsAPI = {
  addEcoPoints: async (userId: number, points: number) => {
    const res = await apiCall(
      `/eco-points/add?userId=${userId}&points=${points}`,
      { method: "POST" }
    );

    if (!res.success) {
      throw new Error(res.message || "Failed to add EcoPoints");
    }

    return true;
  },

  getMyStats: async (userId: number) => {
    const res = await apiCall(`/eco-points/student/${userId}`);

    if (!res.success) {
      throw new Error(res.message || "Failed to fetch stats");
    }

    return res.data; // { ecoPoints, level }
  },
};
