# Use Node.js 20 Alpine for smaller image size
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Development stage
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client

RUN npx prisma generate

EXPOSE 3000
ENV PORT 3000

# Start development server
CMD ["npm", "run", "dev"]

# Production builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g tsx

# Set dummy DATABASE_URL for build (Prisma needs it for generate, but won't connect during build)
# This prevents database connection attempts during static page generation
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
ENV DATABASE_URL=$DATABASE_URL

# Set other required environment variables for build (with defaults)
ARG BETTER_AUTH_SECRET="dummy-secret-for-build-only"
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ARG NEXT_PUBLIC_APP_URL="https://rein.truyens.pro"
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SITE_URL="https://rein.truyens.pro"
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Generate Prisma client and build
RUN npx prisma generate
# Build with production environment
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner (for staging)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
# Copy standalone output (requires output: 'standalone' in next.config.ts)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# Copy src directory for scripts (regenerate-thumbnails, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
# Copy scripts directory
# Copy tsconfig.json for TypeScript path resolution
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# Create uploads directory with proper permissions
RUN mkdir -p /app/public/uploads/thumbnails && \
    chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Note: DATABASE_URL will be set at runtime via docker-compose environment variables
CMD ["node", "server.js"]
