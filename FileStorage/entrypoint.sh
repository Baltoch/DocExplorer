#!/bin/bash
# Starting MinIO server 
minio server /data --console-address :9001 &

# Wait for the MinIO server to start
mc ping local --exit

# Set up mc alias
mc alias set minio http://localhost:9000 minioadmin minioadmin

# Create the MinIO bucket
mc mb minio/docexplorer

# Keep the container running
tail -f /dev/null