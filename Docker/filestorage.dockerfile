# Use MinIO image
FROM minio/minio:RELEASE.2024-03-05T04-48-44Z

# Set environment variables
ENV HOST=localhost
ENV MINIO_ROOT_USER=minioadmin
ENV MINIO_ROOT_PASSWORD=minioadmin
ENV PORT=9000

# Copy entrypoint script
COPY ./FileStorage/entrypoint.sh /entrypoint.sh

# Make the script executable
RUN chmod +x /entrypoint.sh

# Create docexplorer directory
RUN mkdir /docexplorer

# Expose port
EXPOSE ${PORT}
EXPOSE 9001

# Start MinIO server
ENTRYPOINT ["/entrypoint.sh"]