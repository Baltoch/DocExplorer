# Use Node.js 20.11.1 image
FROM node:20.11.1

ENV BACKEND_URL=http://backend:3000
ENV FILE_DIRECTORY=/app/docexplorer

# Create the /app directory
RUN mkdir /app
RUN mkdir /app/docexplorer
WORKDIR /app
COPY ./MetadataGeneration .

# Install dependencies
RUN npm install

# Start server
CMD [ "npm", "start" ]