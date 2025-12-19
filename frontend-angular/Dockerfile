# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application without SSR for static nginx deployment
RUN npm run build -- --configuration=production --no-prerender --no-ssr

# Production stage
FROM nginx:alpine

# Copy built application from build stage (browser folder for Angular 17+)
COPY --from=build /app/dist/frontend-angular/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
