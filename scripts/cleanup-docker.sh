#!/bin/bash
set -e

echo "🧹 Docker Cleanup Script"
echo "========================"
echo ""

# Show current disk usage
echo "📊 Current Docker disk usage:"
docker system df
echo ""

# Ask for confirmation
read -p "⚠️  This will remove unused Docker resources. Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo ""
echo "🧹 Cleaning up Docker resources..."

# Stop and remove staging containers if they exist
echo "🛑 Stopping staging containers..."
docker compose --env-file .env.staging -f docker-compose.staging.yml down 2>/dev/null || true

# Remove stopped containers
echo "🗑️  Removing stopped containers..."
docker container prune -f

# Remove unused images (not used by any container)
echo "🗑️  Removing unused images..."
docker image prune -f

# Remove unused volumes (be careful - this removes volumes not used by any container)
echo "🗑️  Removing unused volumes..."
echo "   ⚠️  Note: This only removes volumes not attached to any container"
docker volume prune -f

# Remove unused networks
echo "🗑️  Removing unused networks..."
docker network prune -f

# Optional: Remove build cache (can free up a lot of space)
read -p "🗑️  Remove build cache? This can free significant space but will slow down future builds (yes/no): " remove_cache

if [ "$remove_cache" = "yes" ]; then
    echo "🗑️  Removing build cache..."
    docker builder prune -f
else
    echo "⏭️  Skipping build cache cleanup"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Disk usage after cleanup:"
docker system df

