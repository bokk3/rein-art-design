#!/bin/bash
set -e

# Load environment variables
if [ -f .env.staging ]; then
    export $(cat .env.staging | grep -v '^#' | xargs)
fi

EMAIL=${LETSENCRYPT_EMAIL:-admin@rein.truyens.pro}
DOMAIN=${LETSENCRYPT_DOMAIN:-rein.truyens.pro}

echo "🔐 Setting up SSL certificates for $DOMAIN (staging)..."

# Ensure nginx is running (HTTP only, for ACME challenge)
docker compose -f docker-compose.staging.yml up -d nginx

# Wait for nginx
sleep 10

# Check if domain resolves
echo "🔍 Checking DNS resolution..."
if ! dig +short $DOMAIN | grep -q .; then
    echo "❌ DNS not resolving for $DOMAIN"
    echo "   Please ensure DNS is configured before setting up SSL"
    exit 1
fi

echo "✅ DNS resolves correctly"

# Obtain certificate
echo "📜 Obtaining SSL certificate..."
docker compose -f docker-compose.staging.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN

echo "✅ SSL certificate obtained!"
echo "🔄 Restarting nginx..."
docker compose -f docker-compose.staging.yml restart nginx

echo "✅ SSL setup complete!"
echo "🌐 Test with: curl -I https://$DOMAIN"
