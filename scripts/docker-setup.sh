#!/bin/bash

echo "🐳 Setting up Docker environment..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local and add your BETTER_AUTH_SECRET"
    echo "💡 Generate one with: openssl rand -base64 32"
    exit 1
fi

# Start services
echo "🚀 Starting Docker services..."
docker-compose up -d postgres

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run database setup
echo "🗄️  Setting up database..."
docker-compose exec postgres psql -U postgres -d nextjs_auth_template -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database is ready"
else
    echo "❌ Database not ready, waiting longer..."
    sleep 10
fi

# Push schema and seed
echo "📊 Pushing Prisma schema..."
npx prisma db push

echo "🌱 Seeding database..."
npm run clear-and-seed

echo "🎉 Docker setup complete!"
echo "Run 'docker-compose up' to start the full application"