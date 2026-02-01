// API Service Layer for EcoLearn Platform
// This is configured to work with Spring Boot backend
// Replace BASE_URL in .env file with your actual backend URL

import type { StudentUser, TeacherUser, InstitutionUser } from "../types";

const BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : "/api";

// Mock data for demonstration - replace with actual API calls
export const mockUsers: {
  student: StudentUser;
  teacher: TeacherUser;
  institutionAdmin: InstitutionUser;
} = {
  student: {
    id: "1",
    name: "Alex Green",
    email: "alex@ecolearn.com",
    role: "student",
    ecoPoints: 2850,
    level: 12,
    badges: [
      "eco-warrior",
      "tree-planter",
      "water-saver",
      "recycling-champion",
    ],
    coursesCompleted: 8,
    challengesCompleted: 15,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  teacher: {
    id: "2",
    name: "Dr. Emily Woods",
    email: "emily@ecolearn.com",
    role: "teacher",
    studentsManaged: 45,
    coursesCreated: 6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  institutionAdmin: {
    id: "3",
    name: "Dr. Radhika Sharma",
    email: "radhika@ecolearn.com",
    role: "institution",
    institutionName: "Green Valley High School",
    teachersManaged: 18,
    studentsManaged: 820,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Radhika",
  },
};

export const mockCourses = [
  {
    id: "1",
    title: "Climate Change Fundamentals",
    description:
      "Understand the science behind climate change and its global impact",
    thumbnail: "https://images.unsplash.com/photo-1654626565292-10f85a1fad76",
    level: "Beginner",
    duration: "4 weeks",
    ecoPoints: 500,
    enrolledStudents: 234,
    progress: 65,
    modules: 8,
  },
  {
    id: "2",
    title: "Sustainable Living Practices",
    description: "Learn practical ways to reduce your carbon footprint",
    thumbnail: "https://images.unsplash.com/photo-1581081874314-cf94ae666228",
    level: "Intermediate",
    duration: "3 weeks",
    ecoPoints: 400,
    enrolledStudents: 189,
    progress: 30,
    modules: 6,
  },
  {
    id: "3",
    title: "Biodiversity & Ecosystems",
    description: "Explore the importance of biodiversity and ecosystem balance",
    thumbnail: "https://images.unsplash.com/photo-1628539174351-d424cb6bcbfa",
    level: "Advanced",
    duration: "5 weeks",
    ecoPoints: 600,
    enrolledStudents: 156,
    progress: 0,
    modules: 10,
  },
  {
    id: "4",
    title: "Renewable Energy Revolution",
    description: "Discover renewable energy sources and their potential",
    thumbnail: "https://images.unsplash.com/photo-1581081874314-cf94ae666228",
    level: "Intermediate",
    duration: "4 weeks",
    ecoPoints: 450,
    enrolledStudents: 201,
    progress: 0,
    modules: 7,
  },
];

export const mockChallenges = [
  {
    id: "1",
    title: "Plant 10 Trees",
    description: "Organize a tree planting event in your community",
    type: "real-world",
    ecoPoints: 1000,
    difficulty: "Medium",
    duration: "2 weeks",
    participants: 89,
    status: "active",
    icon: "🌳",
  },
  {
    id: "2",
    title: "Zero Waste Week",
    description: "Go one week without producing any plastic waste",
    type: "real-world",
    ecoPoints: 750,
    difficulty: "Hard",
    duration: "1 week",
    participants: 145,
    status: "active",
    icon: "♻️",
  },
  {
    id: "3",
    title: "Energy Conservation Quiz",
    description: "Test your knowledge on energy-saving techniques",
    type: "quiz",
    ecoPoints: 250,
    difficulty: "Easy",
    duration: "30 mins",
    participants: 312,
    status: "active",
    icon: "⚡",
  },
  {
    id: "4",
    title: "Water Warrior Challenge",
    description: "Track and reduce your water consumption for a month",
    type: "real-world",
    ecoPoints: 500,
    difficulty: "Medium",
    duration: "4 weeks",
    participants: 67,
    status: "active",
    icon: "💧",
  },
];

export const mockLeaderboard = [
  {
    rank: 1,
    name: "Sarah Chen",
    school: "Green Valley High",
    ecoPoints: 8950,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    rank: 2,
    name: "Michael Torres",
    school: "Eco Academy",
    ecoPoints: 8720,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    rank: 3,
    name: "Alex Green",
    school: "Sustainability Institute",
    ecoPoints: 2850,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    rank: 4,
    name: "Emma Wilson",
    school: "Green Valley High",
    ecoPoints: 7890,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    rank: 5,
    name: "David Kim",
    school: "Nature School",
    ecoPoints: 7654,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    rank: 6,
    name: "Olivia Brown",
    school: "Eco Academy",
    ecoPoints: 7432,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
  },
  {
    rank: 7,
    name: "James Lee",
    school: "Sustainability Institute",
    ecoPoints: 7201,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    rank: 8,
    name: "Sophia Martinez",
    school: "Green Valley High",
    ecoPoints: 6987,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
  },
];

export const mockBadges = [
  {
    id: "eco-warrior",
    name: "Eco Warrior",
    description: "Complete 10 environmental challenges",
    icon: "🏆",
    earned: true,
    date: "2024-09-15",
  },
  {
    id: "tree-planter",
    name: "Tree Planter",
    description: "Plant 50 trees",
    icon: "🌳",
    earned: true,
    date: "2024-08-20",
  },
  {
    id: "water-saver",
    name: "Water Saver",
    description: "Reduce water usage by 30%",
    icon: "💧",
    earned: true,
    date: "2024-10-01",
  },
  {
    id: "recycling-champion",
    name: "Recycling Champion",
    description: "Recycle 100kg of waste",
    icon: "♻️",
    earned: true,
    date: "2024-07-10",
  },
  {
    id: "climate-expert",
    name: "Climate Expert",
    description: "Complete all climate courses",
    icon: "🌍",
    earned: false,
  },
  {
    id: "energy-master",
    name: "Energy Master",
    description: "Save 500kWh of energy",
    icon: "⚡",
    earned: false,
  },
];

// API helper function with error handling
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = localStorage.getItem("ecolearn_token");
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

// Authentication APIs (mock implementation - replace with actual API calls)
export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail: email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    return await res.json();
    // returns: { user: {...}, token: "..." }
  },
  register: async (userData: any) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Registration failed");
    }

    const data = await res.json();
    return {
      user: {
        id: data.userId,
        ...userData, // merge form data; backend returns only userId
      },
      token: data.token || "", // optional, if backend provides token after signup
    };
  },

  logout: async (token: string) => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Course APIs
export const courseAPI = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockCourses;
  },

  getById: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockCourses.find((c) => c.id === id);
  },

  enroll: async (courseId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, message: "Successfully enrolled!" };
  },
};

// Challenge APIs
export const challengeAPI = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockChallenges;
  },

  participate: async (challengeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, message: "Challenge accepted!", ecoPoints: 50 };
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockLeaderboard;
  },
};

// User APIs
export const userAPI = {
  getProfile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockUsers.student;
  },

  updateProfile: async (userData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, user: { ...mockUsers.student, ...userData } };
  },

  getBadges: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockBadges;
  },
};

// ---- Cloudinary Signed Upload (for quiz questions) ----
export const mediaAPI = {
  uploadImage: async (file: File): Promise<{ secure_url: string }> => {
    if (!file) throw new Error("No file provided");

    // 1. Fetch the signed parameters from backend
    const signatureRes = await fetch(`${BASE_URL}/cloudinary/signature`);
    if (!signatureRes.ok) throw new Error("Failed to get upload signature");
    const { signature, timestamp, apiKey, cloudName, folder } = await signatureRes.json();

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    // 3. Upload to Cloudinary
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Cloudinary error:", errText);
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    if (!data.secure_url) throw new Error("No URL returned from Cloudinary");
    return { secure_url: data.secure_url };
  },
};
