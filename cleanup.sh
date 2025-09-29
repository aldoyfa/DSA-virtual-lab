#!/bin/bash

# DSA Virtual Lab Cleanup Script
set -e

echo "🧹 Cleaning up DSA Virtual Lab deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="dsa-virtual-lab"
CONTAINER_NAME="dsa-virtual-lab"

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

# Stop and remove containers
print_status "Stopping containers..."
docker-compose down 2>/dev/null || true
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Remove Docker images (optional)
if [[ "$1" == "--images" ]]; then
    print_status "Removing Docker images..."
    docker rmi $IMAGE_NAME:latest 2>/dev/null || true
    docker image prune -f
fi

# Clean up Docker system (optional)
if [[ "$1" == "--all" ]]; then
    print_warning "Performing full Docker cleanup..."
    docker system prune -a -f
    docker volume prune -f
fi

print_status "✅ Cleanup completed!"

echo ""
print_status "Usage:"
echo "  ./cleanup.sh           - Stop and remove containers only"
echo "  ./cleanup.sh --images  - Also remove Docker images"
echo "  ./cleanup.sh --all     - Full Docker system cleanup (use with caution)"