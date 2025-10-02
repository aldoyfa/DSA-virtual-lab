# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install serve package globally for serving static files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 15012

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:15012/ || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "15012"]