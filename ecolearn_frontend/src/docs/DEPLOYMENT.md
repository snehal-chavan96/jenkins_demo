# 🚀 EcoLearn - Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the EcoLearn platform in various environments, from local development to production Docker deployment with Spring Boot backend integration.

---

## 📋 Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Docker**: v20.0.0 or higher (for containerized deployment)
- **Docker Compose**: v2.0.0 or higher
- **Git**: v2.30.0 or higher

### Optional
- **Java**: v17+ (for Spring Boot backend)
- **Maven/Gradle**: Latest version (for backend build)

---

## 🏗️ Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/ecolearn.git
cd ecolearn
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080/api

# Optional: Enable debug mode
VITE_DEBUG=true

# Optional: Analytics
VITE_ANALYTICS_ID=your-analytics-id
```

### 4. Start Development Server
```bash
npm run dev
# Server will start at http://localhost:5173
```

### 5. Build for Production
```bash
npm run build
# Output will be in /dist directory
```

### 6. Preview Production Build
```bash
npm run preview
# Preview at http://localhost:4173
```

---

## 🐳 Docker Deployment

### Quick Start with Docker

#### 1. Build the Docker Image
```bash
docker build -t ecolearn-frontend:latest .
```

#### 2. Run the Container
```bash
docker run -d \
  --name ecolearn-app \
  -p 80:80 \
  -e API_BASE_URL=http://your-backend-url:8080/api \
  ecolearn-frontend:latest
```

#### 3. Access the Application
Open your browser and navigate to: `http://localhost`

---

## 🔧 Docker Compose Deployment

### Full Stack (Frontend + Backend)

#### 1. Create `docker-compose.yml`
```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - API_BASE_URL=http://backend:8080/api
    depends_on:
      - backend
    networks:
      - ecolearn-network

  # Backend (Spring Boot)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DATABASE_URL=postgresql://db:5432/ecolearn
    depends_on:
      - db
    networks:
      - ecolearn-network

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=ecolearn
      - POSTGRES_USER=ecolearn_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ecolearn-network

volumes:
  postgres_data:

networks:
  ecolearn-network:
    driver: bridge
```

#### 2. Start All Services
```bash
docker-compose up -d
```

#### 3. View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

#### 4. Stop Services
```bash
docker-compose down

# With volume cleanup
docker-compose down -v
```

---

## 🌐 Production Deployment

### Nginx Configuration (Production)

The included `nginx.conf` provides:
- Gzip compression
- Browser caching
- SPA routing support
- Security headers

```nginx
server {
    listen 80;
    server_name ecolearn.example.com;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Browser caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### SSL/TLS Configuration

#### Using Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d ecolearn.example.com

# Auto-renewal
sudo certbot renew --dry-run
```

#### Updated Nginx with SSL
```nginx
server {
    listen 80;
    server_name ecolearn.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ecolearn.example.com;

    ssl_certificate /etc/letsencrypt/live/ecolearn.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ecolearn.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ... rest of config
}
```

---

## ☁️ Cloud Deployment

### AWS EC2 Deployment

#### 1. Launch EC2 Instance
- Instance type: t3.small or higher
- OS: Ubuntu 22.04 LTS
- Security groups: Allow ports 22, 80, 443

#### 2. Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose-plugin
```

#### 3. Deploy Application
```bash
# Clone repository
git clone https://github.com/your-org/ecolearn.git
cd ecolearn

# Start with Docker Compose
docker-compose up -d
```

### AWS ECS Deployment

#### 1. Create Task Definition
```json
{
  "family": "ecolearn-frontend",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "your-ecr-repo/ecolearn-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "API_BASE_URL",
          "value": "https://api.ecolearn.com"
        }
      ]
    }
  ]
}
```

#### 2. Create Service
```bash
aws ecs create-service \
  --cluster ecolearn-cluster \
  --service-name ecolearn-frontend \
  --task-definition ecolearn-frontend:1 \
  --desired-count 2 \
  --launch-type FARGATE
```

### Google Cloud Run Deployment

#### 1. Build and Push Image
```bash
# Build image
gcloud builds submit --tag gcr.io/PROJECT_ID/ecolearn-frontend

# Deploy to Cloud Run
gcloud run deploy ecolearn-frontend \
  --image gcr.io/PROJECT_ID/ecolearn-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars API_BASE_URL=https://backend-url
```

### Azure Container Instances

```bash
az container create \
  --resource-group ecolearn-rg \
  --name ecolearn-frontend \
  --image your-acr.azurecr.io/ecolearn-frontend:latest \
  --dns-name-label ecolearn \
  --ports 80
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
- **Never commit** `.env` files to Git
- Use environment-specific configurations
- Rotate secrets regularly

### 2. Docker Security
```dockerfile
# Use specific versions
FROM node:18-alpine AS build

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

# Multi-stage builds
FROM nginx:alpine AS production
COPY --from=build --chown=nodejs:nodejs /app/dist /usr/share/nginx/html
```

### 3. Nginx Hardening
```nginx
# Hide nginx version
server_tokens off;

# Limit request size
client_max_body_size 10M;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20;

# CORS (if needed)
add_header Access-Control-Allow-Origin "https://ecolearn.com" always;
```

### 4. HTTPS Only
- Always use HTTPS in production
- Enable HSTS header
- Redirect HTTP to HTTPS

---

## 📊 Monitoring & Logging

### Docker Logs
```bash
# View logs
docker logs -f ecolearn-app

# Export logs to file
docker logs ecolearn-app > app.log 2>&1
```

### Health Checks
Add to `docker-compose.yml`:
```yaml
services:
  frontend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Application Monitoring
- **Frontend**: Use tools like Sentry, LogRocket
- **Backend**: Spring Boot Actuator
- **Infrastructure**: Prometheus + Grafana

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t ecolearn-frontend:${{ github.sha }} .
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker tag ecolearn-frontend:${{ github.sha }} your-registry/ecolearn-frontend:latest
          docker push your-registry/ecolearn-frontend:latest
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/ecolearn
            docker-compose pull
            docker-compose up -d
```

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. Container Won't Start
```bash
# Check logs
docker logs ecolearn-app

# Inspect container
docker inspect ecolearn-app

# Verify network
docker network ls
docker network inspect ecolearn-network
```

#### 2. API Connection Issues
```bash
# Test from container
docker exec -it ecolearn-app sh
curl http://backend:8080/api/health

# Check environment variables
docker exec ecolearn-app env
```

#### 3. Build Failures
```bash
# Clear build cache
docker builder prune -af

# Rebuild without cache
docker build --no-cache -t ecolearn-frontend .
```

#### 4. Permission Issues
```bash
# Fix ownership
sudo chown -R $USER:$USER .

# Fix Docker socket
sudo chmod 666 /var/run/docker.sock
```

---

## 📈 Performance Optimization

### 1. Build Optimization
```dockerfile
# Enable build caching
ENV DOCKER_BUILDKIT=1

# Use .dockerignore
node_modules/
.git/
dist/
*.md
```

### 2. Nginx Optimization
```nginx
# Enable HTTP/2
listen 443 ssl http2;

# Worker configuration
worker_processes auto;
worker_rlimit_nofile 65535;

# Increase buffer sizes
client_body_buffer_size 10M;
client_max_body_size 10M;
```

### 3. Application Optimization
- Code splitting enabled (Vite default)
- Tree shaking for minimal bundle size
- Lazy loading for routes
- Image optimization with ImageWithFallback

---

## 🔄 Update & Maintenance

### Rolling Updates
```bash
# Update with zero downtime
docker-compose up -d --no-deps --build frontend

# Rollback if needed
docker-compose up -d frontend:previous-tag
```

### Database Migrations
```bash
# Run migrations before deploying
docker-compose exec backend ./mvnw flyway:migrate

# Backup before migrations
docker-compose exec db pg_dump -U ecolearn_user ecolearn > backup.sql
```

### Scheduled Maintenance
```bash
# Clean up unused images
docker image prune -af

# Clean up volumes (careful!)
docker volume prune -f

# System-wide cleanup
docker system prune -af --volumes
```

---

## 📞 Support & Resources

### Documentation
- [React Docs](https://react.dev)
- [Docker Docs](https://docs.docker.com)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)

### Community
- GitHub Issues: Report bugs and request features
- Discord: Join our community for support
- Email: support@ecolearn.com

---

## 📝 Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] SSL certificates obtained
- [ ] Backup strategy in place
- [ ] Monitoring setup
- [ ] Load testing completed

### Post-Deployment
- [ ] Health checks passing
- [ ] Logs monitored
- [ ] Performance metrics reviewed
- [ ] User testing completed
- [ ] Documentation updated
- [ ] Team notified

---

**Last Updated:** October 28, 2025  
**Version:** 2.0  
**Maintained by:** EcoLearn DevOps Team
