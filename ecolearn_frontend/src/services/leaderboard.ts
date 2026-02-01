import { apiCall } from "./api";

export const leaderboardAPI = {
    getGlobal:async() =>{

      const res = await apiCall("/eco-points/leaderboard");

      if(!res.success){
        throw new Error(res.message || "Failed to fetch leaderboard");
      }

      return res.data;
    } 

}