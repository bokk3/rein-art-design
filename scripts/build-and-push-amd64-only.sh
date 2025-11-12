#!/bin/bash
set -e

# Build and push AMD64-only image (for building on AMD64 machine or CI/CD)
# This is much faster than cross-compiling on Raspberry Pi

# Configuration
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-your-username}"
IMAGE_NAME="${IMAGE_NAME:-rein-art-design}"
TAG="${TAG:-amd64-local}"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "🐳 Building and pushing AMD64 image to Docker Hub..."
echo "   Image: ${FULL_IMAGE_NAME}"
echo "   Platform: linux/amd64"
echo ""
echo "ℹ️  Set TAG (e.g. TAG=latest) if you want to overwrite a different repository tag."
echo ""

# Check if Docker Hub username is set
if [ "$DOCKERHUB_USERNAME" = "your-username" ]; then
    echo "❌ Please set DOCKERHUB_USERNAME environment variable"
    echo "   Example: export DOCKERHUB_USERNAME=yourusername"
    exit 1
fi

# Check if user is logged in to Docker Hub
if ! docker info | grep -q "Username"; then
    echo "⚠️  Not logged in to Docker Hub"
    echo "   Run: docker login"
    read -p "   Do you want to login now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker login
    else
        echo "❌ Please login to Docker Hub first"
        exit 1
    fi
fi

# Check current architecture
ARCH=$(uname -m)
if [ "$ARCH" != "x86_64" ] && [ "$ARCH" != "amd64" ]; then
    echo "⚠️  WARNING: You're not on an AMD64 machine"
    echo "   Current architecture: $ARCH"
    echo "   This will use emulation which is slower"
    echo ""
    read -p "   Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build and push AMD64 image
echo ""
echo "🔨 Building for AMD64 (this may take a while)..."
echo ""

docker buildx build \
    --platform linux/amd64 \
    --target runner \
    --tag ${FULL_IMAGE_NAME} \
    --push \
    --build-arg NODE_ENV=production \
    --build-arg DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public" \
    --build-arg BETTER_AUTH_SECRET="dummy-secret-for-build-only" \
    --build-arg NEXT_PUBLIC_APP_URL="https://rein.truyens.pro" \
    --build-arg NEXT_PUBLIC_SITE_URL="https://rein.truyens.pro" \
    .

echo ""
echo "✅ Successfully built and pushed AMD64 image!"
echo "   Image: ${FULL_IMAGE_NAME}"
echo "   Platform: linux/amd64"
echo ""
echo "📝 To pull this image on an AMD64 server:"
echo "   docker pull ${FULL_IMAGE_NAME}"
echo ""
echo "📝 To use in docker-compose:"
echo "   image: ${FULL_IMAGE_NAME}"
echo "   # Remove the 'build' section and use 'image' instead"

