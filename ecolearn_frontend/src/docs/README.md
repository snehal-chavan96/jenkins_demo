# 🌱 EcoLearn - Gamified Environmental Education Platform

A modern, human-centered, fully responsive gamified web platform for environmental education designed for schools and colleges. Built with React, TypeScript, TailwindCSS, and optimized for Spring Boot backend integration and Docker deployment.

**Version 2.0** - Production Ready | Child-Friendly | Nature-Themed | Fully Responsive | Clean Architecture

## 🏗️ NEW: Production-Ready Folder Structure

This project now follows industry-standard best practices with a clean, organized folder structure. See [RESTRUCTURING_SUMMARY.md](./RESTRUCTURING_SUMMARY.md) for details.

## 🚀 Quick Start

```bash
# 1. Restructure the project (first time only)
chmod +x restructure.sh
./restructure.sh

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Build for production
npm run build
```

## 📂 Project Structure

```
ecolearn/
├── src/                          # Source code
│   ├── components/               # React components
│   │   ├── common/              # Shared components (Navbar, Loader, etc.)
│   │   ├── ui/                  # Shadcn UI components
│   │   └── figma/               # Figma-specific components
│   ├── pages/                   # Page components
│   ├── layouts/                 # Layout wrappers
│   ├── context/                 # React Context providers
│   ├── services/                # API services
│   ├── types/                   # TypeScript type definitions
│   ├── styles/                  # Global styles
│   ├── App.tsx                  # Main App component
│   └── main.tsx                 # Entry point
├── docs/                        # Documentation
├── public/                      # Static assets
├── Dockerfile                   # Docker configuration
├── docker-compose.yml           # Docker Compose setup
├── nginx.conf                   # Nginx configuration
└── package.json                 # Dependencies
```

## ✨ Features

### 🎓 For Students
- **Interactive Courses**: Engaging multimedia environmental education content
- **Real-World Challenges**: Complete eco-tasks like tree planting and waste reduction
- **Gamification**: Earn eco-points, unlock badges, and climb the leaderboard
- **Progress Tracking**: Monitor your learning journey and achievements
- **Personalized Dashboard**: View stats, recent activities, and recommendations

### 👨‍🏫 For Teachers
- **Course Management**: Create and assign environmental lessons
- **Student Tracking**: Monitor student progress and engagement
- **Quiz Creation**: Design interactive assessments
- **Analytics Dashboard**: View performance metrics and statistics
- **Leaderboard Management**: Track top performers

## 🚀 Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: TailwindCSS v4 (utility-first)
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Yup validation
- **Notifications**: Sonner (toast notifications)
- **State Management**: Context API
- **HTTP Client**: Fetch API (ready for Axios integration)

## 🎯 Key Pages & Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page with platform overview | Public |
| `/login` | User authentication | Public |
| `/register` | New user registration | Public |
| `/dashboard` | Student personalized dashboard | Protected (Student) |
| `/teacher-dashboard` | Teacher management dashboard | Protected (Teacher) |
| `/courses` | Browse and enroll in courses | Protected |
| `/challenges` | View and accept eco-challenges | Protected |
| `/leaderboard` | Global and school rankings | Protected |
| `/rewards` | View earned badges and achievements | Protected |
| `/profile` | User profile and settings | Protected |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ecolearn.git
cd ecolearn
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to `http://localhost:5173`

### Demo Credentials

**Student Account:**
- Email: `alex@ecolearn.com`
- Password: `demo123`

**Teacher Account:**
- Email: `teacher@ecolearn.com`
- Password: `demo123`

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the image
docker build -t ecolearn-frontend .

# Run the container
docker run -p 3000:80 ecolearn-frontend
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

## 🔌 Backend Integration

The frontend is ready for Spring Boot backend integration. See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed instructions.

### Quick Integration Steps:

1. Update `VITE_API_BASE_URL` in `.env`
2. Replace mock implementations in `src/services/api.ts`
3. Configure CORS in Spring Boot
4. Implement JWT authentication
5. Test API endpoints

### Required Backend Endpoints:

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/courses
GET    /api/challenges
GET    /api/leaderboard/global
GET    /api/users/profile
GET    /api/users/badges
```

## 🎨 Design System

### Color Palette
- **Primary**: Green (#10b981) to Emerald (#059669)
- **Secondary**: Blue, Purple, Orange (for accents)
- **Neutrals**: Gray scale for backgrounds and text
- **Success**: Green
- **Error**: Red
- **Warning**: Yellow

### Typography
- Default typography system defined in `globals.css`
- No font size classes needed (uses semantic HTML)

### Components
- Consistent card-based layouts
- Smooth transitions and animations
- Responsive grid systems
- Mobile-first approach

## 📱 Responsive Design

The platform is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- JWT token-based authentication
- Protected routes with authentication guards
- Input validation on forms
- XSS protection
- CSRF token support (backend integration required)
- Secure password handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests (if configured)
npm run test:e2e
```

## 📈 Performance Optimization

- Code splitting with React lazy loading
- Image optimization with fallback components
- Nginx caching for static assets
- Minified production builds
- Tree shaking for minimal bundle size

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Frontend: React + TypeScript + TailwindCSS
- Backend: Spring Boot (integration guide provided)
- DevOps: Docker + Nginx

## 📧 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- Review the API documentation

## 🎯 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Video lessons integration
- [ ] Social features (forums, groups)
- [ ] AI-powered recommendations
- [ ] Multilingual support
- [ ] Advanced analytics dashboard
- [ ] Certificate generation

## 🌟 Acknowledgments

- shadcn/ui for beautiful component library
- Lucide for comprehensive icon set
- Unsplash for environmental images
- Community contributors

---

**Made with 💚 for a sustainable future**

*EcoLearn - Learn, Act, and Lead the Environmental Revolution*