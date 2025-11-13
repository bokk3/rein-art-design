# Staging Deployment Guide

Quick reference for deploying to `rein.truyens.pro`.

## Prerequisites

- Docker & Docker Compose installed
- DNS pointing `rein.truyens.pro` to server IP
- Ports 80 and 443 open
- `.env.staging` file configured

## Quick Deploy

### 1. Prepare Database Backup (on dev server)

```bash
./scripts/backup-dev-db.sh
# Backup saved to: backups/backup_dev_YYYYMMDD_HHMMSS.sql
```

### 2. Commit and Push Backup

```bash
git add backups/backup_dev_*.sql
git commit -m "Add database backup"
git push
```

### 3. Deploy on Staging Server

```bash
# Pull latest code
git pull

# Clean up Docker (optional, frees space)
./scripts/cleanup-docker.sh

# Deploy
./scripts/deploy-staging.sh
```

The script will:
- ✅ Pull/build application image from DockerHub (if `APP_IMAGE` is set)
- ✅ Start PostgreSQL and restore database from latest backup
- ✅ Start application
- ✅ Set up SSL certificates automatically
- ✅ Configure nginx with HTTPS

## Configuration

### `.env.staging` Required Variables

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_strong_password
POSTGRES_DB=rein_staging

# Application
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_APP_URL=https://rein.truyens.pro
NEXT_PUBLIC_SITE_URL=https://rein.truyens.pro
NEXT_PUBLIC_BASE_URL=https://rein.truyens.pro

# SSL
LETSENCRYPT_EMAIL=your_email@example.com

# DockerHub (optional - speeds up deployment)
APP_IMAGE=your-username/rein-art-design:staging-latest
```

## Common Commands

### Using Helper Script (Recommended)

```bash
# View logs
./scripts/docker-compose-staging.sh logs -f

# Check status
./scripts/docker-compose-staging.sh ps

# Restart services
./scripts/docker-compose-staging.sh restart app
./scripts/docker-compose-staging.sh restart nginx

# Stop all
./scripts/docker-compose-staging.sh down
```

### Manual Commands

```bash
# Full command (if not using helper)
docker compose --env-file .env.staging -f docker-compose.staging.yml <command>
```

## Troubleshooting

### SSL Certificate Issues

If SSL setup fails during deployment:

```bash
./scripts/setup-ssl-staging.sh
```

### Nginx Not Starting

```bash
# Check logs
./scripts/docker-compose-staging.sh logs nginx

# Verify config
docker exec rein-nginx-staging nginx -t
```

### Database Restore Failed

```bash
# Check backup file exists
ls -lh backups/*.sql

# Manually restore
docker cp backups/backup_dev_*.sql rein-postgres-staging:/tmp/backup.sql
docker exec rein-postgres-staging psql -U postgres -d rein_staging -f /tmp/backup.sql
```

### Application Not Starting

```bash
# Check logs
./scripts/docker-compose-staging.sh logs app

# Check database connection
docker exec rein-postgres-staging psql -U postgres -d rein_staging -c "SELECT 1;"
```

## Backup Strategy

### Create Backup (on dev server)

```bash
./scripts/backup-dev-db.sh
```

### Restore Backup (during deployment)

The deployment script automatically finds and restores:
1. `database.bak` (root)
2. `backup_db.bak` (root)
3. Latest `.sql` file in `backups/` directory

## Update Deployment

### Quick Update from DockerHub (Recommended)

When a new image is pushed to DockerHub:

```bash
# On staging server: update container with new image
./scripts/update-staging.sh
```

This script will:
- Pull the latest image from DockerHub
- Stop the current container
- Start the new container
- Verify it's running

### Manual Update

```bash
# Pull latest image
docker pull your-username/rein-art-design:staging-latest

# Restart with new image
./scripts/docker-compose-staging.sh up -d app --force-recreate
```

### After Code Changes (Build & Push)

```bash
# On dev/build server: build and push to DockerHub
docker buildx build --platform linux/amd64,linux/arm64 \
  -t your-username/rein-art-design:staging-latest \
  --push .

# On staging server: update
./scripts/update-staging.sh
```

### Full Redeploy

```bash
./scripts/deploy-staging.sh
```

## Architecture

- **PostgreSQL**: Database (port 5434 exposed for direct access)
- **App**: Next.js application (internal port 3000)
- **Nginx**: Reverse proxy with SSL (ports 80, 443)
- **Certbot**: Automatic SSL certificate renewal

All containers use `.env.staging` automatically via `env_file` directive.

## Notes

- SSL certificates auto-renew via certbot container
- Database and uploads are persisted in Docker volumes
- All staging containers are prefixed with `-staging`
- Platform-agnostic: works on ARM64 (Raspberry Pi) and AMD64

