#!/bin/bash

echo "Waiting for MySQL..."
until mysqladmin ping --host=127.0.0.1 --silent; do
  sleep 2
done

echo "Initializing database..."

mysql -u root <<EOF
CREATE DATABASE IF NOT EXISTS ecolearn;

ALTER USER 'root'@'localhost'
IDENTIFIED WITH mysql_native_password BY 'root';

ALTER USER 'root'@'%'
IDENTIFIED WITH mysql_native_password BY 'root';

FLUSH PRIVILEGES;
EOF

echo "MySQL initialization done"
