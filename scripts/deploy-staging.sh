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
docker compose -f docker-compose.staging.yml down

# Create necessary directories
mkdir -p nginx/ssl
mkdir -p nginx/conf.d

# Build application first (this takes a while on Pi)
echo "🔨 Building application (this may take 15-30 minutes on Raspberry Pi)..."
docker compose -f docker-compose.staging.yml build app

# Start database
echo "🗄️  Starting database..."
docker compose -f docker-compose.staging.yml up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker compose -f docker-compose.staging.yml exec -T postgres pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ PostgreSQL failed to start within 60 seconds"
        exit 1
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

# Restore database or initialize
if [ "$RESTORE_DB" = true ]; then
    echo "📦 Restoring database from backup..."
    
    # Create database if it doesn't exist
    docker compose -f docker-compose.staging.yml exec -T postgres psql -U ${POSTGRES_USER:-postgres} -c "CREATE DATABASE ${POSTGRES_DB:-rein_staging};" 2>/dev/null || true
    
    # Copy backup into container
    docker cp backup_db.bak rein-postgres-staging:/tmp/backup_db.bak
    
    # Restore database
    if docker compose -f docker-compose.staging.yml exec -T postgres psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-rein_staging} -f /tmp/backup_db.bak > /dev/null 2>&1; then
        echo "✅ Database restored from backup!"
    else
        echo "⚠️  Backup restore failed (might be in different format). Initializing fresh database..."
        # Run migrations and seed
        docker compose -f docker-compose.staging.yml run --rm app npx prisma db push
        docker compose -f docker-compose.staging.yml run --rm app npm run clear-and-seed
        echo "✅ Fresh database initialized!"
    fi
else
    echo "🆕 Initializing fresh database..."
    docker compose -f docker-compose.staging.yml run --rm app npx prisma db push
    docker compose -f docker-compose.staging.yml run --rm app npm run clear-and-seed
    echo "✅ Database initialized!"
fi

# Start application
echo "🚀 Starting application..."
docker compose -f docker-compose.staging.yml up -d app

# Wait for app to be ready
echo "⏳ Waiting for application to start..."
sleep 5

# Copy existing uploads if they exist (after app is running)
if [ -d "public/uploads" ] && [ "$(ls -A public/uploads 2>/dev/null)" ]; then
    echo "📁 Copying uploads to volume..."
    docker cp public/uploads/. rein-app-staging:/app/public/uploads/ 2>/dev/null || {
        echo "⚠️  Upload copy failed, but continuing..."
    }
fi

# Setup SSL certificates (nginx needs app to be running for proxy)
echo "🔐 Setting up SSL certificates..."

# Check if certificates already exist in volume
CERT_EXISTS=$(docker compose -f docker-compose.staging.yml run --rm --no-deps certbot test -f /etc/letsencrypt/live/rein.truyens.pro/fullchain.pem 2>/dev/null && echo "yes" || echo "no")

if [ "$CERT_EXISTS" != "yes" ]; then
    echo "   Obtaining new SSL certificates..."
    
    # Start nginx with HTTP-only config for ACME challenge
    # First, create a temporary nginx config for ACME challenge only
    cat > nginx/nginx-temp.conf << 'EOF'
events {
    worker_connections 1024;
}
http {
    server {
        listen 80;
        server_name rein.truyens.pro;
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        location / {
            return 301 https://$server_name$request_uri;
        }
    }
}
EOF
    
    # Temporarily use temp config
    mv nginx/nginx-staging.conf nginx/nginx-staging.conf.bak 2>/dev/null || true
    cp nginx/nginx-temp.conf nginx/nginx-staging.conf
    
    # Start nginx for ACME challenge
    docker compose -f docker-compose.staging.yml up -d nginx
    sleep 10
    
    # Obtain SSL certificate
    if docker compose -f docker-compose.staging.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${LETSENCRYPT_EMAIL:-admin@rein.truyens.pro} \
        --agree-tos \
        --no-eff-email \
        -d rein.truyens.pro; then
        echo "✅ SSL certificate obtained!"
    else
        echo "⚠️  SSL certificate generation failed. You can run: ./scripts/setup-ssl-staging.sh"
    fi
    
    # Restore original nginx config
    mv nginx/nginx-staging.conf.bak nginx/nginx-staging.conf 2>/dev/null || true
    rm nginx/nginx-temp.conf 2>/dev/null || true
else
    echo "✅ SSL certificates already exist."
fi

# Restart nginx with full SSL configuration
echo "🔄 Starting nginx with SSL configuration..."
docker compose -f docker-compose.staging.yml up -d nginx

# Start certbot renewal service
echo "🔄 Starting certbot renewal service..."
docker compose -f docker-compose.staging.yml up -d certbot

echo ""
echo "✅ Staging deployment complete!"
echo "🌐 Application should be available at https://rein.truyens.pro"
echo ""
echo "📊 Useful commands:"
echo "   View logs:     docker compose -f docker-compose.staging.yml logs -f"
echo "   Check status:  docker compose -f docker-compose.staging.yml ps"
echo "   Restart app:   docker compose -f docker-compose.staging.yml restart app"
echo "   Stop all:      docker compose -f docker-compose.staging.yml down"
echo ""
echo "🔍 Verify deployment:"
echo "   curl -I https://rein.truyens.pro"
echo "   docker compose -f docker-compose.staging.yml logs -f app"
