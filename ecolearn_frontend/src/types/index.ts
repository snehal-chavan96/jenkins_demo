// Base User
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// Student Type
export interface StudentUser extends BaseUser {
  role: "student";
  ecoPoints: number;
  level: number;
  badges: string[];
  coursesCompleted: number;
  challengesCompleted: number;
}

// Teacher Type
export interface TeacherUser extends BaseUser {
  role: "teacher";
  studentsManaged: number;
  coursesCreated: number;
}

// Institution Type
export interface InstitutionUser extends BaseUser {
  role: "institution";
  institutionName: string;
  teachersManaged: number;
  studentsManaged: number;
}

// Union
export type User = StudentUser | TeacherUser | InstitutionUser;



// Badge Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  duration: string;
  points: number;
  thumbnail?: string;
  topics: string[];
  enrolled?: boolean;
  completed?: boolean;
}

// Challenge Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'real-world';
  difficulty: number;
  points: number;
  participants: number;
  deadline?: string;
  completed?: boolean;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  points: number;
  badges: number;
  level: number;
}

// Analytics Types
export interface AnalyticsData {
  totalPoints: number;
  coursesCompleted: number;
  averageScore: number;
  currentStreak: number;
  weeklyProgress: Array<{
    day: string;
    points: number;
    quizzes: number;
    courses: number;
  }>;
  courseProgress: Array<{
    name: string;
    completion: number;
    points: number;
    color: string;
  }>;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
