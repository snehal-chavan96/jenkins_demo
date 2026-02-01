#!/bin/bash

echo "Starting MySQL..."
service mysql start

# Wait for MySQL to be ready
until mysqladmin ping -uroot -proot --silent; do
    echo "Waiting for MySQL..."
    sleep 2
done

echo "Initializing database..."

# Setup root user + create DB
mysql -uroot -proot <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
CREATE DATABASE IF NOT EXISTS ecolearn;
EOF

echo "MySQL OK -> Starting Spring Boot"
java -jar /app/app.jar
