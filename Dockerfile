##############################################
# STAGE 1: Backend Build (Spring Boot)
##############################################
FROM eclipse-temurin:21-jdk-jammy AS backend-build

WORKDIR /backend

COPY ecolearn_backend/mvnw .
COPY ecolearn_backend/.mvn .mvn
RUN chmod +x mvnw

COPY ecolearn_backend/pom.xml .
RUN ./mvnw -B dependency:go-offline

COPY ecolearn_backend/src ./src
RUN ./mvnw clean package -DskipTests


##############################################
# STAGE 2: Frontend Build (Vite / React)
##############################################
FROM node:18-alpine AS frontend-build

WORKDIR /frontend

COPY ecolearn_frontend/package*.json ./
RUN npm install

COPY ecolearn_frontend/ .
RUN npm run build


##############################################
# STAGE 3: Runtime Image
##############################################
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    openjdk-21-jre-headless \
    nginx \
    supervisor \
    mysql-server \
    mysql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend-build /backend/target/*.jar /app/app.jar
COPY --from=frontend-build /frontend/dist /var/www/html

COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY mysql-init.sh /app/mysql-init.sh

RUN chmod +x /app/mysql-init.sh

RUN mkdir -p /var/run/mysqld \
 && chown -R mysql:mysql /var/run/mysqld \
 && chown -R mysql:mysql /var/lib/mysql

RUN sed -i "s/^bind-address/# bind-address/" /etc/mysql/mysql.conf.d/mysqld.cnf

EXPOSE 80 8080 3306

CMD ["supervisord", "-n"]
