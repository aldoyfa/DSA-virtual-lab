#!/bin/bash

# DSA Virtual Lab - VPS Management Script
# Ensures the service runs in background and survives SSH disconnection

set -e

# Configuration
CONTAINER_NAME="dsa-virtual-lab"
IMAGE_NAME="dsa-virtual-lab"
PORT="15012"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to start the service
start_service() {
    print_status "🚀 Starting DSA Virtual Lab service..."
    
    # Remove existing container if it exists
    if docker ps -a | grep -q $CONTAINER_NAME; then
        print_warning "Stopping existing container..."
        docker stop $CONTAINER_NAME 2>/dev/null || true
        docker rm $CONTAINER_NAME 2>/dev/null || true
    fi
    
    # Start new container with proper settings for VPS
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        --log-driver json-file \
        --log-opt max-size=10m \
        --log-opt max-file=3 \
        -p $PORT:15012 \
        --memory="512m" \
        --memory-swap="1g" \
        --cpus="1.0" \
        --health-cmd="wget --no-verbose --tries=1 --spider http://127.0.0.1:15012/ || exit 1" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=3 \
        --health-start-period=40s \
        -e NODE_ENV=production \
        $IMAGE_NAME:latest
    
    sleep 5
    
    if docker ps | grep -q $CONTAINER_NAME; then
        print_status "✅ Service started successfully!"
        docker ps | grep $CONTAINER_NAME
    else
        print_error "❌ Service failed to start"
        docker logs $CONTAINER_NAME
        exit 1
    fi
}

# Function to check service status
check_status() {
    print_status "📊 Checking service status..."
    
    if docker ps | grep -q $CONTAINER_NAME; then
        print_status "✅ Service is running"
        echo ""
        docker ps | grep $CONTAINER_NAME
        echo ""
        print_status "Health status:"
        docker inspect $CONTAINER_NAME | grep -A 5 '"Health":'
    else
        if docker ps -a | grep -q $CONTAINER_NAME; then
            print_warning "⚠️  Service container exists but is not running"
            docker ps -a | grep $CONTAINER_NAME
        else
            print_error "❌ Service container not found"
        fi
    fi
}

# Function to show logs
show_logs() {
    print_status "📋 Showing service logs..."
    if docker ps -a | grep -q $CONTAINER_NAME; then
        docker logs --tail=50 -f $CONTAINER_NAME
    else
        print_error "Container not found"
        exit 1
    fi
}

# Function to stop service
stop_service() {
    print_status "🛑 Stopping DSA Virtual Lab service..."
    if docker ps | grep -q $CONTAINER_NAME; then
        docker stop $CONTAINER_NAME
        print_status "✅ Service stopped"
    else
        print_warning "Service is not running"
    fi
}

# Function to restart service
restart_service() {
    print_status "🔄 Restarting DSA Virtual Lab service..."
    stop_service
    sleep 2
    start_service
}

# Function to setup systemd service (optional)
setup_systemd() {
    print_status "🔧 Setting up systemd service for auto-start..."
    
    sudo tee /etc/systemd/system/dsa-virtual-lab.service > /dev/null << EOF
[Unit]
Description=DSA Virtual Lab Container
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/bin/docker start $CONTAINER_NAME
ExecStop=/usr/bin/docker stop $CONTAINER_NAME
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable dsa-virtual-lab.service
    print_status "✅ Systemd service created and enabled"
}

# Main menu
case "${1:-}" in
    "start")
        start_service
        ;;
    "stop")
        stop_service
        ;;
    "restart")
        restart_service
        ;;
    "status")
        check_status
        ;;
    "logs")
        show_logs
        ;;
    "setup-systemd")
        setup_systemd
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|setup-systemd}"
        echo ""
        echo "Commands:"
        echo "  start         - Start the DSA Virtual Lab service"
        echo "  stop          - Stop the DSA Virtual Lab service" 
        echo "  restart       - Restart the DSA Virtual Lab service"
        echo "  status        - Check service status"
        echo "  logs          - Show service logs (follow mode)"
        echo "  setup-systemd - Setup systemd service for auto-start"
        echo ""
        echo "Current status:"
        check_status
        ;;
esac