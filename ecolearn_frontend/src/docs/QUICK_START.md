# 🚀 EcoLearn - Quick Start Guide

Get the EcoLearn platform up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm
- Basic knowledge of React and TypeScript

## 5-Minute Setup

### Step 1: Environment Configuration (30 seconds)
```bash
# Create .env file
cp .env.example .env

# Edit .env (optional - has default values)
nano .env
```

### Step 2: Install Dependencies (2 minutes)
```bash
npm install
```

### Step 3: Start Development Server (30 seconds)
```bash
npm run dev
```

### Step 4: Open Browser
Navigate to: `http://localhost:5173`

## 🎯 Try It Out

### Login as Student
1. Click "Login" or "Get Started"
2. Click "Student Demo" button
3. Credentials are auto-filled
4. Click "Sign In"
5. Explore the student dashboard!

### Login as Teacher
1. Click "Login"
2. Click "Teacher Demo" button
3. Credentials are auto-filled
4. Click "Sign In"
5. Explore the teacher dashboard!

## 📋 Available Demo Accounts

### Student Account
- **Email**: `alex@ecolearn.com`
- **Password**: `demo123`
- **Features**: Courses, Challenges, Leaderboard, Rewards, Profile

### Teacher Account
- **Email**: `teacher@ecolearn.com`
- **Password**: `demo123`
- **Features**: Course Management, Student Tracking, Analytics

## 🗺️ Platform Tour

### For Students

1. **Dashboard** (`/dashboard`)
   - View your eco-points and level
   - See recent achievements
   - Continue learning from where you left off

2. **Courses** (`/courses`)
   - Browse environmental courses
   - Filter by difficulty level
   - Enroll and track progress

3. **Challenges** (`/challenges`)
   - Accept real-world eco-tasks
   - Complete quizzes
   - Earn eco-points

4. **Leaderboard** (`/leaderboard`)
   - See global rankings
   - Compare with classmates
   - Track your position

5. **Rewards** (`/rewards`)
   - View earned badges
   - See locked achievements
   - Track completion rate

6. **Profile** (`/profile`)
   - Edit personal information
   - View activity history
   - Manage account settings

### For Teachers

1. **Teacher Dashboard** (`/teacher-dashboard`)
   - Monitor student engagement
   - View course statistics
   - Quick action buttons

2. **Courses** (`/courses`)
   - Create new courses
   - Assign to students
   - Track completion rates

3. **Leaderboard** (`/leaderboard`)
   - View top performers
   - Monitor class progress

## 🎨 UI Components Showcase

The platform includes:
- ✅ Responsive navigation bar
- ✅ Animated page transitions
- ✅ Interactive cards and modals
- ✅ Progress indicators
- ✅ Toast notifications
- ✅ Badge system with animations
- ✅ Search and filter functionality
- ✅ Form validation
- ✅ Loading states

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📁 Key Files to Customize

### 1. API Service (`/services/api.ts`)
Replace mock data with real API calls:
```typescript
// Change this
const mockData = [...];

// To this
const response = await apiCall('/api/endpoint');
```

### 2. Environment Variables (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Colors (`/styles/globals.css`)
Customize the theme by modifying CSS variables.

### 4. Navigation (`/components/Navbar.tsx`)
Add or remove menu items as needed.

## 🐳 Docker Quick Start

```bash
# Build image
docker build -t ecolearn .

# Run container
docker run -p 3000:80 ecolearn

# Access at http://localhost:3000
```

## 🔌 Backend Integration (5 Steps)

1. **Set Backend URL**
   ```env
   VITE_API_BASE_URL=http://your-backend:8080/api
   ```

2. **Update API Service**
   Open `/services/api.ts` and replace mock implementations

3. **Configure CORS** in Spring Boot
   ```java
   @CrossOrigin(origins = "http://localhost:3000")
   ```

4. **Test Endpoints**
   Ensure all required endpoints are implemented

5. **Deploy**
   Use Docker Compose to run both frontend and backend

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed instructions.

## 🎯 Next Steps

- [ ] Replace mock data with real API calls
- [ ] Configure backend endpoints
- [ ] Add your school's branding
- [ ] Customize courses and challenges
- [ ] Set up authentication
- [ ] Deploy to production

## 💡 Tips

1. **Hot Reload**: Changes are reflected instantly during development
2. **Console Logs**: Check browser console for API call information
3. **Mock Data**: All data in `/services/api.ts` can be customized
4. **Responsive**: Test on different screen sizes
5. **Animations**: Powered by Framer Motion for smooth UX

## ❓ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear build cache
rm -rf dist .vite
npm run build
```

## 📚 Documentation

- [README.md](./README.md) - Complete project overview
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Backend integration
- [DEPENDENCIES.md](./DEPENDENCIES.md) - Required packages

## 🎉 You're Ready!

Start exploring the platform and customize it for your needs. Happy coding! 🌱

---

**Need Help?**
- Check the console for errors
- Review the integration guide
- Verify all dependencies are installed
- Ensure Node.js version is 18+
