#!/bin/bash

# DSA Virtual Lab Deployment Script
set -e

echo "🚀 Starting DSA Virtual Lab deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="dsa-virtual-lab"
IMAGE_TAG="latest"
CONTAINER_NAME="dsa-virtual-lab"
PORT="15012"
DOMAIN="aldoy.ykd.dev"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_warning "Docker Compose not found. Installing..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Stop and remove existing container
print_status "Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Build the Docker image
print_status "Building Docker image..."
docker build -t $IMAGE_NAME:$IMAGE_TAG .

# Option 1: Run with Docker Compose (recommended)
if [[ "$1" == "--compose" ]]; then
    print_status "Starting with Docker Compose..."
    docker-compose up -d
    
    print_status "Waiting for container to be healthy..."
    sleep 10
    
    # Check if container is running
    if docker-compose ps | grep -q "Up"; then
        print_status "✅ Container started successfully!"
        print_status "🌐 Application available at: http://localhost:$PORT"
        print_status "🌐 Domain: https://$DOMAIN (if configured)"
        
        # Show logs
        echo ""
        print_status "Recent logs:"
        docker-compose logs --tail=10
    else
        print_error "❌ Container failed to start"
        docker-compose logs
        exit 1
    fi

# Option 2: Run with Docker directly
else
    print_status "Starting container..."
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $PORT:15012 \
        -e NODE_ENV=production \
        $IMAGE_NAME:$IMAGE_TAG
    
    print_status "Waiting for container to be ready..."
    sleep 5
    
    # Check if container is running
    if docker ps | grep -q $CONTAINER_NAME; then
        print_status "✅ Container started successfully!"
        print_status "🌐 Application available at: http://localhost:$PORT"
        print_status "🌐 Domain: https://$DOMAIN (if configured)"
        
        # Show container info
        echo ""
        print_status "Container information:"
        docker ps | grep $CONTAINER_NAME
        
        # Show recent logs
        echo ""
        print_status "Recent logs:"
        docker logs --tail=10 $CONTAINER_NAME
    else
        print_error "❌ Container failed to start"
        docker logs $CONTAINER_NAME
        exit 1
    fi
fi

echo ""
print_status "🎉 Deployment completed!"
print_status "📊 Access your DSA Virtual Lab at: http://localhost:$PORT"

# Show useful commands
echo ""
print_status "Useful commands:"
echo "  - View logs: docker logs -f $CONTAINER_NAME"
echo "  - Stop container: docker stop $CONTAINER_NAME"
echo "  - Restart container: docker restart $CONTAINER_NAME"
echo "  - Remove container: docker rm -f $CONTAINER_NAME"
echo "  - Health check: curl http://localhost:$PORT/health"