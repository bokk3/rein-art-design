#!/bin/bash
set -e

echo "🔄 Updating staging deployment from DockerHub..."

# Check if .env.staging exists
if [ ! -f .env.staging ]; then
    echo "❌ .env.staging not found. Please create it from .env.staging.example"
    exit 1
fi

# Load environment variables
export $(cat .env.staging | grep -v '^#' | xargs)

# Check if APP_IMAGE is set
if [ -z "$APP_IMAGE" ]; then
    echo "❌ APP_IMAGE not set in .env.staging"
    echo "   Please set APP_IMAGE=your-username/rein-art-design:staging-latest"
    exit 1
fi

echo "📥 Pulling latest image: $APP_IMAGE"
docker pull "$APP_IMAGE"

if [ $? -ne 0 ]; then
    echo "❌ Failed to pull image from DockerHub"
    exit 1
fi

echo "✅ Image pulled successfully"

# Stop the app container
echo "🛑 Stopping application..."
docker compose --env-file .env.staging -f docker-compose.staging.yml stop app

# Remove the old container (but keep volumes)
echo "🗑️  Removing old container..."
docker compose --env-file .env.staging -f docker-compose.staging.yml rm -f app

# Start the new container
echo "🚀 Starting updated application..."
docker compose --env-file .env.staging -f docker-compose.staging.yml up -d app

# Wait for app to be ready
echo "⏳ Waiting for application to start..."
sleep 10

# Check if app is running
if docker compose --env-file .env.staging -f docker-compose.staging.yml ps app | grep -q "Up"; then
    echo "✅ Application updated and running!"
    echo ""
    echo "📊 Check status:"
    echo "   ./scripts/docker-compose-staging.sh ps"
    echo ""
    echo "📋 View logs:"
    echo "   ./scripts/docker-compose-staging.sh logs -f app"
else
    echo "⚠️  Application may have issues. Check logs:"
    echo "   ./scripts/docker-compose-staging.sh logs app"
    exit 1
fi

