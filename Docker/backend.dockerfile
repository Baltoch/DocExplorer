# Use Node.js 20.11.1 image
FROM node:20.11.1

# Set environment variables
ENV PORT=3000

# Create the /app directory
RUN mkdir app
WORKDIR /app
COPY ./Backend .

# Install dependencies
RUN npm install

# Expose port
EXPOSE $PORT

# Start server
CMD [ "npm", "start" ]