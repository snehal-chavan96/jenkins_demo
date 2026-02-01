# EcoLearn Platform - Spring Boot Integration Guide

## Overview
This guide provides instructions for integrating the EcoLearn React frontend with a Spring Boot backend.

## Architecture

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────┐
│   React SPA     │──────▶│  Spring Boot API  │──────▶│  Database   │
│  (Port 3000)    │       │   (Port 8080)     │       │ (PostgreSQL)│
└─────────────────┘       └──────────────────┘       └─────────────┘
```

## Frontend Structure

```
src/
├── services/
│   └── api.ts              # API service layer - UPDATE THIS FILE
├── context/
│   └── AuthContext.tsx     # Authentication state management
├── components/
│   ├── Navbar.tsx
│   └── Loader.tsx
└── pages/
    ├── Login.tsx
    ├── Register.tsx
    ├── StudentDashboard.tsx
    ├── TeacherDashboard.tsx
    ├── Courses.tsx
    ├── Challenges.tsx
    ├── Leaderboard.tsx
    ├── Rewards.tsx
    └── Profile.tsx
```

## Backend API Endpoints Required

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate` - Validate token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/badges` - Get user badges

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses/:id/enroll` - Enroll in course

### Challenges
- `GET /api/challenges` - Get all challenges
- `POST /api/challenges/:id/participate` - Join challenge

### Leaderboard
- `GET /api/leaderboard/global` - Get global leaderboard
- `GET /api/leaderboard/school/:id` - Get school leaderboard

## Integration Steps

### 1. Environment Configuration
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. Update API Service
Open `src/services/api.ts` and replace mock implementations with actual API calls:

```typescript
// Example: Real API implementation
export const authAPI = {
  login: async (email: string, password: string) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  // ... other methods
};
```

### 3. Spring Boot CORS Configuration
Add CORS configuration to your Spring Boot application:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 4. JWT Authentication
Modify the `apiCall` function in `src/services/api.ts` to include JWT token:

```typescript
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('ecolearn_token');
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return await response.json();
};
```

## Docker Deployment

### Development
```bash
# Build and run frontend only
docker build -t ecolearn-frontend .
docker run -p 3000:80 ecolearn-frontend
```

### Production with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Spring Boot DTOs

### Request/Response Models

```java
// Login Request
public class LoginRequest {
    private String email;
    private String password;
}

// User Response
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String role; // "student" or "teacher"
    private Integer ecoPoints;
    private Integer level;
    private String avatar;
}

// Course Response
public class CourseResponse {
    private String id;
    private String title;
    private String description;
    private String thumbnail;
    private String level;
    private String duration;
    private Integer ecoPoints;
    private Integer enrolledStudents;
    private Integer progress;
    private Integer modules;
}

// Challenge Response
public class ChallengeResponse {
    private String id;
    private String title;
    private String description;
    private String type; // "real-world" or "quiz"
    private Integer ecoPoints;
    private String difficulty;
    private String duration;
    private Integer participants;
    private String status;
    private String icon;
}
```

## Error Handling

### Frontend
The frontend handles errors with toast notifications and try-catch blocks in all API calls.

### Backend
Ensure your Spring Boot application returns proper HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Security Considerations

1. **Authentication**: Implement JWT token-based authentication
2. **HTTPS**: Use HTTPS in production
3. **CORS**: Configure CORS properly for your domain
4. **Input Validation**: Validate all inputs on the backend
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Environment Variables**: Never commit sensitive data to version control

## Testing

### Frontend Testing
```bash
npm test
```

### API Testing
Use tools like Postman or curl to test backend endpoints:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ecolearn.com","password":"password123"}'
```

## Performance Optimization

1. **Code Splitting**: Already implemented with React lazy loading
2. **Image Optimization**: Use WebP format for images
3. **Caching**: Configure nginx caching for static assets
4. **Database Indexing**: Add indexes on frequently queried fields
5. **Connection Pooling**: Configure database connection pooling in Spring Boot

## Monitoring & Logging

- Frontend: Use browser console and error boundaries
- Backend: Integrate Spring Boot Actuator for health checks
- Logging: Implement structured logging with SLF4J

## Support

For issues or questions:
1. Check the documentation
2. Review API endpoint responses
3. Check browser console for frontend errors
4. Review Spring Boot logs for backend errors

## Next Steps

1. Set up your Spring Boot backend
2. Configure database connections
3. Implement authentication endpoints
4. Update frontend API service
5. Test integration
6. Deploy to production

---

**Note**: This is a developer-friendly setup designed for easy integration with Spring Boot. All mock data in `services/api.ts` should be replaced with real API calls once your backend is ready.
