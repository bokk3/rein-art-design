#!/bin/bash
# Helper script to run TypeScript scripts in the container
# This installs tsx locally if needed

set -e

SCRIPT_NAME=${1:-"regenerate-thumbnails"}

echo "🚀 Running script in container: $SCRIPT_NAME"

# Check if tsx is available locally
if docker exec rein-app-staging sh -c "[ -f /app/node_modules/.bin/tsx ]"; then
    echo "✅ tsx found, running script..."
    docker exec rein-app-staging sh -c "cd /app && npx tsx scripts/${SCRIPT_NAME}.ts"
else
    echo "📦 tsx not found, installing locally..."
    docker exec rein-app-staging sh -c "cd /app && npm install tsx --save-dev"
    echo "✅ tsx installed, running script..."
    docker exec rein-app-staging sh -c "cd /app && npx tsx scripts/${SCRIPT_NAME}.ts"
fi

