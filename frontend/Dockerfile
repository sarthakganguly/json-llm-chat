# Stage 1: Build the React application
# We use the node:20-alpine image as it's small and has Node.js and npm.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install all project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production. This creates a static 'dist' folder.
RUN npm run build

# ---

# Stage 2: Serve the application using Nginx
# We use a lightweight Nginx image to serve the static files.
FROM nginx:1.25-alpine

# Copy the build output from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# We'll add a custom nginx.conf later to handle SPA routing, but this is enough for now.

# Expose port 80 for the Nginx server
EXPOSE 80
