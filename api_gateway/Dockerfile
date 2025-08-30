# Stage 1: Build the React application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy only the package.json file to leverage Docker's caching.
COPY ./frontend/package.json ./
# This will also create a package-lock.json inside the container.
RUN npm install

# Now, copy the rest of the frontend source code.
COPY ./frontend ./
RUN npm run build

# Stage 2: Create the final Nginx image
FROM nginx:1.25-alpine
# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy the new Nginx configuration
COPY ./api_gateway/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]