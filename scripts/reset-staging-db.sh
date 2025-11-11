#!/bin/bash
set -e

echo "⚠️  WARNING: This will reset the staging database!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cancelled"
    exit 1
fi

# Load environment variables
if [ -f .env.staging ]; then
    export $(cat .env.staging | grep -v '^#' | xargs)
fi

echo "🛑 Stopping application..."
docker-compose -f docker-compose.staging.yml stop app

echo "🗑️  Removing database volume..."
docker-compose -f docker-compose.staging.yml down -v postgres_data_staging
docker volume rm $(docker volume ls -q | grep postgres_data_staging) 2>/dev/null || true

echo "🔄 Starting fresh database..."
docker-compose -f docker-compose.staging.yml up -d postgres

# Wait for PostgreSQL
sleep 10

echo "🆕 Initializing database..."
docker-compose -f docker-compose.staging.yml run --rm app npx prisma db push
docker-compose -f docker-compose.staging.yml run --rm app npm run clear-and-seed

echo "🚀 Restarting application..."
docker-compose -f docker-compose.staging.yml up -d app

echo "✅ Staging database reset complete!"
