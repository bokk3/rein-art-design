# Staging Deployment Guide - rein.truyens.pro

## Overview

This guide covers deploying the Rein Art Design CMS to a Raspberry Pi staging server at `rein.truyens.pro`.

## Prerequisites

1. **Raspberry Pi 4 (4GB RAM)** running Ubuntu 24 Server
2. **DNS Configuration**: Point `rein.truyens.pro` A record to your Pi's IP (192.168.3.51 or public IP)
3. **Docker & Docker Compose** installed
4. **Ports 80 and 443** open in firewall
5. **Staging branch** checked out

## Initial Setup

### 1. Setup Server

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y

# Log out and back in for group changes
exit### 2. Clone/Checkout Staging Branch

# Clone repository
git clone <your-repo-url> rein-art-design
cd rein-art-design

# Checkout staging branch
git checkout staging

# Or if branch doesn't exist yet, create it
git checkout -b staging### 3. Configure Environment

# Copy staging environment template
cp .env.staging.example .env.staging

# Edit environment file
nano .env.staging

# Set these required values:
# - NEXT_PUBLIC_APP_URL=https://rein.truyens.pro
# - NEXT_PUBLIC_SITE_URL=https://rein.truyens.pro
# - POSTGRES_PASSWORD (strong password)
# - BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)
# - LETSENCRYPT_EMAIL (your email for certificate notifications)### 4. Verify DNS

# Check DNS resolution
dig rein.truyens.pro +short

# Should return your Pi's IP (192.168.3.51 or public IP)### 5. Deploy

# Make scripts executable
chmod +x scripts/*.sh

# Run deployment
./scripts/deploy-staging.sh### 6. Verify Deployment

# Check containers
docker-compose -f docker-compose.staging.yml ps

# Check logs
docker-compose -f docker-compose.staging.yml logs -f app

# Test HTTPS
curl -I https://rein.truyens.pro

# Test in browser
# Open https://rein.truyens.pro## Daily Operations

### View Logs
sh
# Application logs
docker-compose -f docker-compose.staging.yml logs -f app

# All logs
docker-compose -f docker-compose.staging.yml logs -f

# Nginx logs
docker-compose -f docker-compose.staging.yml logs -f nginx### Update Application

# Pull latest changes from staging branch
git pull origin staging

# Rebuild and restart
docker-compose -f docker-compose.staging.yml build app
docker-compose -f docker-compose.staging.yml up -d app

# Or full redeploy
./scripts/deploy-staging.sh### Reset Database

# Reset staging database (WARNING: deletes all data)
./scripts/reset-staging-db.sh### Restore Database from Backup

# Ensure backup_db.bak is in project root
# Then redeploy
./scripts/deploy-staging.sh## Troubleshooting

### SSL Certificate Issues
h
# Manually setup SSL
./scripts/setup-ssl-staging.sh

# Check certificate expiration
docker-compose -f docker-compose.staging.yml exec certbot certbot certificates

# Renew certificate manually
docker-compose -f docker-compose.staging.yml run --rm certbot renew
### Out of Memory

# Check memory usage
docker stats

# If needed, add swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab### Database Connection Issues

# Check database container
docker-compose -f docker-compose.staging.yml ps postgres

# Check database logs
docker-compose -f docker-compose.staging.yml logs postgres

# Test connection
docker-compose -f docker-compose.staging.yml exec postgres psql -U postgres -d rein_staging -c "SELECT 1;"### Build Issues on Pi

# If builds are slow, consider building on a faster machine
# Then transfer the image:

# On build machine:
docker save rein-art-design-app-staging | gzip > app-image.tar.gz

# Transfer to Pi:
scp app-image.tar.gz user@rein.local:/path/to/project/

# On Pi:
docker load < app-image.tar.gz
docker-compose -f docker-compose.staging.yml up -d app## Firewall Configuration

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
## Port Forwarding (If Behind Router)

If your Pi is behind a router:

1. Configure port forwarding:
   - Port 80 → 192.168.3.51:80
   - Port 443 → 192.168.3.51:443

2. Update firewall:
   sudo ufw allow from 192.168.0.0/16 to any port 80
   sudo ufw allow from 192.168.0.0/16 to any port 443
   ## Monitoring

### Resource Usage

# Docker stats
docker stats

# Disk usage
docker system df

# Volume sizes
docker volume ls
docker volume inspect <volume_name>### Health Checks

# Check all services
docker-compose -f docker-compose.staging.yml ps

# Check application health
curl -I https://rein.truyens.pro

# Check database
docker-compose -f docker-compose.staging.yml exec postgres pg_isready -U postgres## Backup Strategy

### Database Backup
ash
# Manual backup
docker-compose -f docker-compose.staging.yml exec postgres pg_dump -U postgres -d rein_staging > backup_staging_$(date +%Y%m%d).sql

# Or use the backup script (if created)
./scripts/backup-db.sh### Uploads Backup

# Copy uploads from volume
docker cp rein-app-staging:/app/public/uploads ./backups/uploads_$(date +%Y%m%d)## Staging vs Production

### Staging Environment
- Database: `rein_staging`
- More lenient rate limits
- X-Environment: staging header
- Easier to reset/test
- Separate credentials

### Production Environment (Future)
- Database: `rein_production`
- Stricter rate limits
- Production-grade monitoring
- Backup strategy
- Separate server/domain

## Notes

- Staging uses separate database (`rein_staging`) to avoid conflicts
- SSL certificates auto-renew via Certbot container
- Resource limits are set for Pi 4 (4GB RAM)
- Uploads are persisted in Docker volume
- Database is persisted in Docker volume
- All staging-specific containers are prefixed with `-staging`
