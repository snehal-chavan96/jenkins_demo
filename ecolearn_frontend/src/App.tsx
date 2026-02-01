import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';


import { Navbar } from './components/common/Navbar';
import { Loader } from './components/common/Loader';
import { ChatbotWidget } from './components/common/ChatbotWidget';

import { Toaster } from './components/ui/sonner';
import './styles/globals.css';


// Public Pages
import { Landing } from './pages/landing/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { Courses } from './pages/Courses';
import { Challenges } from './pages/ChallengesNew';
import { Leaderboard } from './pages/Leaderboard';
import { Rewards } from './pages/Rewards';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';

// Games
import { BubbleShooter } from './pages/games/BubbleShooter';
import { WaterConservation } from './pages/games/WaterConservation';
import { PickUsRight } from './pages/games/PickUsRight';
import { EcoPlacementChallenge } from './pages/games/EcoPlacementChallenge';
import { WildlifeRescueMission } from './pages/games/WildlifeRescueMission';
import { EcoTicTacToe } from './pages/games/EcoTicTacToe';

import VideoEmbed from './pages/VideoEmbed';


// Student Quizzes
import { StudentQuizzes } from './pages//student/StudentQuizzes';
import { TakeQuiz } from './pages/student/TakeQuiz';
import { QuizResultPage } from './pages/student/QuizResultPage';
import { EpicChallenges } from './pages/EpicChallenges';

// Teacher Pages (Modular Folder)
import { TeacherDashboard } from './pages/TeacherDashboard';
import { Classes } from './pages/teacher/Classes';
import { StudentList } from './pages/ClassList';
import { CourseManagement } from './pages/teacher/CourseManagement';
import { QuizManagement } from './pages/teacher/QuizManagement';
import { CreateEditQuiz } from './pages/teacher/CreateEditQuiz';
import { QuizResults } from './pages/teacher/QuizResults';
import { Announcements } from './pages/teacher/Announcements';
import { TeacherProfile } from './pages/teacher/TeacherProfile';
import { EpicChallengeSubmissions } from './pages/teacher/EpicChallengesSubmissions';


// Institution
import { InstitutionDashboard } from './pages/InstitutionDashboard';


// -----------------------
// ROUTE GUARDS
// -----------------------
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const studentRoutes = [
    '/dashboard',
    '/courses',
    '/challenges',
    '/leaderboard',
    '/rewards',
    '/analytics',
    '/profile',
    '/eco-placement-challenge',
    '/wildlife-rescue-mission',
    '/quizzes',
    '/take-quiz',
    '/quiz-result',
    '/epic-challenges/create',
  ];
  const showCursor = studentRoutes.includes(location.pathname);


  return <>
    {showCursor}
    {children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <Loader />;

  if (isAuthenticated) {
    if (user?.role === 'teacher') return <Navigate to="/teacher-dashboard" replace />;
    if (user?.role === 'institution') return <Navigate to="/institution-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};


// -----------------------
// MAIN APP CONTENT
// -----------------------
function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#dbeafe] to-[#fef3c7] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] transition-colors duration-300">

      <Navbar />

      <Routes>

        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><Register /></PublicRoute>
        } />
        <Route path="/chat" element={<ChatbotWidget />} />


        {/* ---------------- STUDENT ROUTES ---------------- */}
        <Route path="/dashboard" element={
          <ProtectedRoute><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/courses" element={
          <ProtectedRoute><Courses /></ProtectedRoute>
        } />
        <Route path="/challenges" element={
          <ProtectedRoute><Challenges /></ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute><Leaderboard /></ProtectedRoute>
        } />
        <Route path="/rewards" element={
          <ProtectedRoute><Rewards /></ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute><Analytics /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Games */}
        <Route path="/bubble-shooter" element={<ProtectedRoute><BubbleShooter /></ProtectedRoute>} />
        <Route path="/water-conservation" element={<ProtectedRoute><WaterConservation /></ProtectedRoute>} />
        <Route path="/pick-us-right" element={<ProtectedRoute><PickUsRight /></ProtectedRoute>} />
        <Route path="/eco-placement-challenge" element={<ProtectedRoute><EcoPlacementChallenge /></ProtectedRoute>} />
        <Route path="/eco-tic-tac-toe" element={<ProtectedRoute><EcoTicTacToe /></ProtectedRoute>} />
        
        <Route
          path="/wildlife-rescue-mission"
          element={
            <ProtectedRoute>
              <WildlifeRescueMission />
            </ProtectedRoute>
          }
        />


        {/* Student Quiz System */}
        <Route path="/quizzes" element={<ProtectedRoute><StudentQuizzes /></ProtectedRoute>} />
        <Route path="/take-quiz" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
        <Route path="/quiz-result" element={<ProtectedRoute><QuizResultPage /></ProtectedRoute>} />
        <Route
          path="/epic-challenges/create"
          element={
            <ProtectedRoute>
              <EpicChallenges />
            </ProtectedRoute>
          }
        />
         <Route
          path="/epic-submissions"
          element={
            <ProtectedRoute>
              <EpicChallengeSubmissions />
            </ProtectedRoute>
          }
        />

        <Route path="/demo-video" element={<VideoEmbed />} />


        {/* ---------------- TEACHER ROUTES ---------------- */}
        <Route path="/teacher-dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />

        {/* Teacher Classes */}
        <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
        <Route path="/class-list" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />

        {/* Teacher Course + Quiz Management */}
        <Route path="/course-management" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>} />
        <Route path="/quiz-management" element={<ProtectedRoute><QuizManagement /></ProtectedRoute>} />
        <Route path="/create-edit-quiz" element={<ProtectedRoute><CreateEditQuiz /></ProtectedRoute>} />
        <Route path="/quiz-results" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
        <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
        <Route path="/teacher-profile" element={<ProtectedRoute><TeacherProfile /></ProtectedRoute>} />


        {/* ---------------- INSTITUTION ROUTES ---------------- */}
        <Route path="/institution-dashboard" element={<ProtectedRoute><InstitutionDashboard /></ProtectedRoute>} />


        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      <Toaster position="top-right" richColors />
    </div>
  );
}


// -----------------------
// ROOT APP
// -----------------------
export default function App() {
  return (
    <Router>
      <AuthProvider>
      
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
   
      </AuthProvider>
    </Router>
  );
}
