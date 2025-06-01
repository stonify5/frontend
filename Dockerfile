# Dockerfile for Frontend (assuming a static build, e.g., with Nginx)

# Use an official Nginx image as a parent image
FROM nginx:alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy only the public directory contents to Nginx public directory
COPY public/ .

# Expose port 80
EXPOSE 80

# Start Nginx and keep it in the foreground
CMD ["nginx", "-g", "daemon off;"]
