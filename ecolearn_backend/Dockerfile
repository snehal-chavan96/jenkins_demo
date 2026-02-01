# ************************************************************************
# Separate dockerFile for springboot
# ************************************************************************

# =========================
# Stage 1: Build JAR
# =========================
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /build

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN ./mvnw dependency:go-offline

COPY src ./src
RUN ./mvnw clean package -DskipTests


# =========================
# Stage 2: Runtime
# =========================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Use non-root user in runtime image (security best practice)
RUN useradd -m spring
USER spring

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]



# ************************************************************************
# Combined dockerFile for springboot and mysql
# ************************************************************************

# # =========================
# # Stage 1: Build JAR
# # =========================
# FROM eclipse-temurin:21-jdk-jammy AS builder

# WORKDIR /build

# COPY mvnw .
# COPY .mvn .mvn
# COPY pom.xml .

# # Cache dependencies
# RUN ./mvnw dependency:go-offline

# COPY src ./src

# # Build Spring Boot JAR
# RUN ./mvnw clean package -DskipTests

# # =========================
# # Stage 2: Runtime (Spring + MySQL)
# # =========================
# FROM eclipse-temurin:21-jre-jammy

# ENV DEBIAN_FRONTEND=noninteractive

# # Install MySQL + tools
# RUN apt update && apt install -y \
#     mysql-server \
#     && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# # Copy JAR
# COPY --from=builder /build/target/*.jar app.jar

# # Copy startup script
# COPY start.sh /start.sh
# RUN chmod +x /start.sh

# # Expose ports
# EXPOSE 8080 3306

# # Run the startup script
# CMD ["/start.sh"]


# ************************************************************************

# FROM eclipse-temurin:21-jdk-jammy

# ENV DEBIAN_FRONTEND=noninteractive

# # Install MySQL + Supervisor + Maven
# RUN apt update && apt install -y \
#     mysql-server supervisor maven \
#     && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# # Copy backend source
# COPY mvnw .
# COPY .mvn .mvn
# COPY pom.xml .
# COPY src ./src

# # Build Spring Boot jar
# RUN ./mvnw clean package -DskipTests

# # Copy supervisor config
# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# # Expose ports
# EXPOSE 8080 3306

# # Startup command
# CMD ["supervisord", "-n"]
