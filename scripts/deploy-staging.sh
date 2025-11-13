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

# Find latest SQL backup
BACKUP_FILE=""
if [ -f "database.bak" ] && [ -s "database.bak" ]; then
    BACKUP_FILE="database.bak"
    echo "📦 Found database.bak - will restore database"
elif [ -f "backup_db.bak" ] && [ -s "backup_db.bak" ]; then
    BACKUP_FILE="backup_db.bak"
    echo "📦 Found backup_db.bak - will restore database"
elif [ -f "backups/backup_dev_20251112_151001.sql" ]; then
    BACKUP_FILE="backups/backup_dev_20251112_151001.sql"
    echo "📦 Found SQL backup - will restore database"
else
    # Find latest SQL backup in backups directory
    LATEST_BACKUP=$(ls -t backups/*.sql 2>/dev/null | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        BACKUP_FILE="$LATEST_BACKUP"
        echo "📦 Found latest SQL backup: $BACKUP_FILE - will restore database"
    else
        echo "⚠️  No backup file found. Database will be initialized fresh."
        RESTORE_DB=false
    fi
fi

if [ -n "$BACKUP_FILE" ]; then
    RESTORE_DB=true
fi

# Stop existing containers
echo "🛑 Stopping existing staging containers..."
docker compose -f docker-compose.staging.yml down

# Create necessary directories
mkdir -p nginx/ssl
mkdir -p nginx/conf.d

# Build or pull application image
if [ -n "$APP_IMAGE" ]; then
    echo "📥 Pulling application image from DockerHub: $APP_IMAGE"
    docker pull "$APP_IMAGE" || {
        echo "⚠️  Failed to pull image, will build locally instead"
        docker compose -f docker-compose.staging.yml build app
    }
else
    echo "🔨 Building application (this may take 15-30 minutes on Raspberry Pi)..."
    echo "   💡 Tip: Set APP_IMAGE in .env.staging to use DockerHub image instead"
    docker compose -f docker-compose.staging.yml build app
fi

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
if [ "$RESTORE_DB" = true ] && [ -n "$BACKUP_FILE" ]; then
    echo "📦 Restoring database from backup: $BACKUP_FILE"
    
    # Create database if it doesn't exist
    docker compose -f docker-compose.staging.yml exec -T postgres psql -U ${POSTGRES_USER:-postgres} -c "DROP DATABASE IF EXISTS ${POSTGRES_DB:-rein_staging};" 2>/dev/null || true
    docker compose -f docker-compose.staging.yml exec -T postgres psql -U ${POSTGRES_USER:-postgres} -c "CREATE DATABASE ${POSTGRES_DB:-rein_staging};" 2>/dev/null || true
    
    # Copy backup into container
    docker cp "$BACKUP_FILE" rein-postgres-staging:/tmp/backup.sql
    
    # Restore database (handle both .sql and .bak formats)
    if [[ "$BACKUP_FILE" == *.sql ]]; then
        # SQL dump format
        if docker compose -f docker-compose.staging.yml exec -T postgres psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-rein_staging} -f /tmp/backup.sql > /dev/null 2>&1; then
            echo "✅ Database restored from SQL backup!"
        else
            echo "⚠️  SQL restore failed. Trying alternative method..."
            docker compose -f docker-compose.staging.yml exec -T postgres bash -c "psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-rein_staging} < /tmp/backup.sql" > /dev/null 2>&1 && \
                echo "✅ Database restored!" || \
                echo "⚠️  Backup restore failed. Initializing fresh database..."
            RESTORE_DB=false
        fi
    else
        # Assume .bak format (custom dump)
        if docker compose -f docker-compose.staging.yml exec -T postgres psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-rein_staging} -f /tmp/backup.sql > /dev/null 2>&1; then
            echo "✅ Database restored from backup!"
        else
            echo "⚠️  Backup restore failed. Initializing fresh database..."
            RESTORE_DB=false
        fi
    fi
fi

# Initialize fresh database if restore failed or no backup
if [ "$RESTORE_DB" != true ]; then
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
sleep 10

# Copy existing uploads if they exist (after app is running)
if [ -d "public/uploads" ] && [ "$(ls -A public/uploads 2>/dev/null)" ]; then
    echo "📁 Copying uploads to volume..."
    docker cp public/uploads/. rein-app-staging:/app/public/uploads/ 2>/dev/null || {
        echo "⚠️  Upload copy failed, but continuing..."
    }
fi

# Setup SSL certificates
echo "🔐 Setting up SSL certificates..."

# Ensure we're using HTTP-only config first (for certbot)
if [ ! -f "nginx/nginx-staging.conf" ]; then
    echo "❌ nginx/nginx-staging.conf not found!"
    exit 1
fi

# Check if certificates already exist in volume
CERT_EXISTS=$(docker compose -f docker-compose.staging.yml run --rm --no-deps certbot test -f /etc/letsencrypt/live/rein.truyens.pro/fullchain.pem 2>/dev/null && echo "yes" || echo "no")

if [ "$CERT_EXISTS" != "yes" ]; then
    echo "   Obtaining new SSL certificates..."
    
    # Start nginx with HTTP-only config (already configured for ACME challenge)
    echo "   Starting nginx with HTTP-only config for ACME challenge..."
    docker compose -f docker-compose.staging.yml up -d nginx
    
    # Wait for nginx to be ready
    sleep 10
    
    # Verify nginx is running
    if ! docker compose -f docker-compose.staging.yml ps nginx | grep -q "Up"; then
        echo "❌ Nginx failed to start. Check logs: docker compose -f docker-compose.staging.yml logs nginx"
        exit 1
    fi
    
    # Obtain SSL certificate
    echo "   Requesting certificate from Let's Encrypt..."
    if docker compose -f docker-compose.staging.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${LETSENCRYPT_EMAIL:-admin@rein.truyens.pro} \
        --agree-tos \
        --no-eff-email \
        -d rein.truyens.pro; then
        echo "✅ SSL certificate obtained!"
        
        # Switch to SSL config
        echo "   Switching to SSL configuration..."
        cp nginx/nginx-staging.conf.ssl nginx/nginx-staging.conf
    else
        echo "⚠️  SSL certificate generation failed."
        echo "   Nginx will continue running with HTTP-only config."
        echo "   You can manually run: ./scripts/setup-ssl-staging.sh"
    fi
else
    echo "✅ SSL certificates already exist."
    # Use SSL config if certs exist
    if [ -f "nginx/nginx-staging.conf.ssl" ]; then
        cp nginx/nginx-staging.conf.ssl nginx/nginx-staging.conf
        echo "   Using SSL configuration."
    fi
fi

# Restart nginx with appropriate configuration
echo "🔄 Starting nginx..."
docker compose -f docker-compose.staging.yml up -d nginx

# Wait a moment for nginx to start
sleep 5

# Verify nginx is running
if docker compose -f docker-compose.staging.yml ps nginx | grep -q "Up"; then
    echo "✅ Nginx is running"
else
    echo "⚠️  Nginx may have issues. Check logs: docker compose -f docker-compose.staging.yml logs nginx"
fi

# Start certbot renewal service
echo "🔄 Starting certbot renewal service..."
docker compose -f docker-compose.staging.yml up -d certbot

echo ""
echo "✅ Staging deployment complete!"
echo "🌐 Application should be available at:"
if [ "$CERT_EXISTS" = "yes" ] || [ -f "nginx/nginx-staging.conf.ssl" ]; then
    echo "   https://rein.truyens.pro"
else
    echo "   http://rein.truyens.pro (SSL setup pending)"
fi
echo ""
echo "📊 Useful commands:"
echo "   View logs:     docker compose -f docker-compose.staging.yml logs -f"
echo "   Check status:  docker compose -f docker-compose.staging.yml ps"
echo "   Restart app:   docker compose -f docker-compose.staging.yml restart app"
echo "   Stop all:      docker compose -f docker-compose.staging.yml down"
echo ""
echo "🔍 Verify deployment:"
if [ "$CERT_EXISTS" = "yes" ] || [ -f "nginx/nginx-staging.conf.ssl" ]; then
    echo "   curl -I https://rein.truyens.pro"
else
    echo "   curl -I http://rein.truyens.pro"
fi
echo "   docker compose -f docker-compose.staging.yml logs -f app"
