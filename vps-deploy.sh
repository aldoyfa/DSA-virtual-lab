#!/bin/bash

# Quick deployment script for VPS
# This script ensures the service runs persistently in the background

echo "🚀 DSA Virtual Lab - VPS Deployment"
echo "===================================="

# Make scripts executable
chmod +x service.sh

# Build the latest image
echo "🔨 Building Docker image..."
docker build -t dsa-virtual-lab .

# Start the service with persistent settings
echo "🏃 Starting service..."
./service.sh start

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application is now running at:"
echo "   - http://localhost:15012"
echo "   - http://aldoy.ykd.dev:15012"
echo ""
echo "📋 Service management:"
echo "   - Check status: ./service.sh status"
echo "   - View logs: ./service.sh logs"
echo "   - Restart: ./service.sh restart"
echo "   - Stop: ./service.sh stop"
echo ""
echo "🔒 The service will:"
echo "   ✅ Run in the background (detached mode)"
echo "   ✅ Restart automatically if it crashes (--restart unless-stopped)"
echo "   ✅ Survive server reboots (Docker auto-starts)"
echo "   ✅ Continue running after SSH disconnection"
echo ""
echo "💡 Optional: Run './service.sh setup-systemd' for additional systemd integration"