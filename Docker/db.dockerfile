# Use MySQL 8.3.0 image
FROM mysql:8.3.0

# Copy database initialisation script (ran when the server starts)
COPY ./Database/createdb.sql /docker-entrypoint-initdb.d/