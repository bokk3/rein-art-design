#!/bin/bash
set -e

echo "🚀 Starting staging deployment for rein.truyens.pro..."

# Check if .env.staging exists
if [ ! -f .env.staging ]; then
    echo "❌ .env.staging not found. Please create it from .env.staging.example"
    exit 1
fi

# Load environment variables
export $(cat .env.staging | grep -v '^#' | xargs)

# Check if backup exists
if [ ! -f backup_db.bak ]; then
    echo "⚠️  backup_db.bak not found. Database will be initialized fresh."
    RESTORE_DB=false
else
    RESTORE_DB=true
    echo "📦 Found backup_db.bak - will restore database"
fi

# Stop existing containers
echo "🛑 Stopping existing staging containers..."
docker-compose -f docker-compose.staging.yml down

# Create necessary directories
mkdir -p nginx/ssl
mkdir -p nginx/conf.d

# Start nginx temporarily for SSL certificate generation
echo "🌐 Starting nginx for SSL certificate setup..."
docker-compose -f docker-compose.staging.yml up -d nginx 2>/dev/null || true

# Wait for nginx to be ready
sleep 5

# Check if SSL certificates exist
if [ ! -d "certbot_data_staging" ] || [ ! -f "/var/lib/docker/volumes/$(basename $(pwd))_certbot_data_staging/_data/live/rein.truyens.pro/fullchain.pem" ] 2>/dev/null; then
    echo "🔐 SSL certificates not found. Obtaining certificates..."
    
    # Ensure nginx is running for ACME challenge
    docker-compose -f docker-compose.staging.yml up -d nginx
    sleep 10
    
    # Obtain SSL certificate using Certbot
    docker-compose -f docker-compose.staging.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${LETSENCRYPT_EMAIL:-admin@rein.truyens.pro} \
        --agree-tos \
        --no-eff-email \
        -d rein.truyens.pro || {
        echo "⚠️  Certificate generation failed. Continuing with HTTP only for now."
        echo "   You can run: ./scripts/setup-ssl-staging.sh"
    }
else
    echo "✅ SSL certificates already exist."
fi

# Build and start database
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.staging.yml build app
docker-compose -f docker-compose.staging.yml up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker-compose -f docker-compose.staging.yml exec -T postgres pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

# Restore database or initialize
if [ "$RESTORE_DB" = true ]; then
    echo "📦 Restoring database from backup..."
    # Try direct restore first
    docker-compose -f docker-compose.staging.yml exec -T postgres psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-rein_staging} < backup_db.bak 2>/dev/null || {
        echo "⚠️  Direct restore failed, trying alternative method..."
        docker cp backup_db.bak rein-postgres-staging:/tmp/backup_db.bak
        docker-compose -f docker-compose.staging.yml exec -T postgres psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-rein_staging} < backup_db.bak || {
            echo "⚠️  Restore failed. Initializing fresh database..."
            docker-compose -f docker-compose.staging.yml run --rm app npx prisma db push
            docker-compose -f docker-compose.staging.yml run --rm app npm run clear-and-seed
        }
    }
    echo "✅ Database setup complete!"
else
    echo "🆕 Initializing fresh database..."
    docker-compose -f docker-compose.staging.yml run --rm app npx prisma db push
    docker-compose -f docker-compose.staging.yml run --rm app npm run clear-and-seed
    echo "✅ Database initialized!"
fi

# Copy existing uploads if they exist
if [ -d "public/uploads" ] && [ "$(ls -A public/uploads 2>/dev/null)" ]; then
    echo "📁 Copying uploads to volume..."
    docker-compose -f docker-compose.staging.yml up -d app
    sleep 5
    docker cp public/uploads/. rein-app-staging:/app/public/uploads/ 2>/dev/null || {
        echo "⚠️  Upload copy failed, but continuing..."
    }
fi

# Start application
echo "🚀 Starting application..."
docker-compose -f docker-compose.staging.yml up -d app

# Restart nginx with SSL configuration
echo "🔄 Restarting nginx with SSL..."
docker-compose -f docker-compose.staging.yml restart nginx

# Start certbot renewal service
echo "🔄 Starting certbot renewal service..."
docker-compose -f docker-compose.staging.yml up -d certbot

echo ""
echo "✅ Staging deployment complete!"
echo "🌐 Application should be available at https://rein.truyens.pro"
echo ""
echo "📊 Useful commands:"
echo "   View logs:     docker-compose -f docker-compose.staging.yml logs -f"
echo "   Check status:  docker-compose -f docker-compose.staging.yml ps"
echo "   Restart app:   docker-compose -f docker-compose.staging.yml restart app"
echo "   Stop all:      docker-compose -f docker-compose.staging.yml down"
echo ""
echo "🔍 Verify deployment:"
echo "   curl -I https://rein.truyens.pro"
