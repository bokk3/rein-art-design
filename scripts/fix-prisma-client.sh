#!/bin/bash

# Script to fix Prisma client after schema changes
# This ensures the client is regenerated and caches are cleared

echo "🔧 Fixing Prisma client..."

# 1. Regenerate Prisma client
echo "📦 Regenerating Prisma client..."
npx prisma generate

# 2. Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next

# 3. Clear node_modules/.prisma cache (if it exists)
echo "🗑️  Clearing Prisma cache..."
rm -rf node_modules/.prisma

# Regenerate again after clearing cache
npx prisma generate

echo "✅ Done! Please restart your dev server with: npm run dev"

