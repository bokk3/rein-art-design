# Docker Setup

## Quick Start

1. **Copy environment template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Generate and add your secret:**
   ```bash
   # Generate a secret
   openssl rand -base64 32
   
   # Add it to .env.local
   BETTER_AUTH_SECRET="your-generated-secret-here"
   ```

3. **Start the application:**
   ```bash
   # Start database only
   docker-compose up -d postgres
   
   # Setup database schema
   npx prisma db push
   
   # Seed admin account
   npm run clear-and-seed
   
   # Start full application
   docker-compose up
   ```

## Environment Files

- `.env.local.example` - Template (committed to git)
- `.env.local` - Your secrets (NOT committed to git)
- `.env.docker` - Docker-specific config (committed to git)

## Production Deployment

For production, use environment variables or Docker secrets instead of .env files.

## Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Reset database
docker-compose down -v
docker-compose up -d postgres
npx prisma db push
npm run clear-and-seed
```