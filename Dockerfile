# Dockerfile for Frontend (assuming a static build, e.g., with Nginx)

# Use an official Nginx image as a parent image
FROM nginx:alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy only the static directory contents to Nginx public directory
COPY static/ .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx and keep it in the foreground
CMD ["nginx", "-g", "daemon off;"]
