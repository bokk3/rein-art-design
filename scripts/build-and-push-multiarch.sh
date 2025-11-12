#!/bin/bash
set -e

# Build and push multi-architecture images (ARM64 + AMD64)
# This allows the same image to work on both Raspberry Pi and regular servers

# Configuration
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-your-username}"
IMAGE_NAME="${IMAGE_NAME:-rein-art-design}"
TAG="${TAG:-staging-latest}"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "🐳 Building and pushing multi-architecture image to Docker Hub..."
echo "   Image: ${FULL_IMAGE_NAME}"
echo "   Platforms: linux/arm64, linux/amd64"
echo ""

# Check if Docker Hub username is set
if [ "$DOCKERHUB_USERNAME" = "your-username" ]; then
    echo "❌ Please set DOCKERHUB_USERNAME environment variable"
    echo "   Example: export DOCKERHUB_USERNAME=yourusername"
    exit 1
fi

# Check if buildx is available
if ! docker buildx version > /dev/null 2>&1; then
    echo "❌ Docker buildx is not available"
    echo "   Install it or use Docker Desktop which includes buildx"
    exit 1
fi

# Warn if building on ARM64 (Raspberry Pi) for AMD64
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    echo "⚠️  WARNING: You're building on ARM64 (Raspberry Pi)"
    echo "   Cross-compiling for AMD64 will be VERY slow (30-60+ minutes)"
    echo "   Consider using a remote builder or building on an AMD64 machine instead"
    echo ""
    read -p "   Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        echo ""
        echo "💡 Alternatives:"
        echo "   1. Use GitHub Actions (free for public repos)"
        echo "   2. Build on an AMD64 server/computer"
        echo "   3. Use Docker buildx with remote builder"
        echo "   4. Build ARM64 only (faster on Pi)"
        exit 1
    fi
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

# Create and use buildx builder if it doesn't exist
BUILDER_NAME="rein-multiarch-builder"
if ! docker buildx inspect ${BUILDER_NAME} > /dev/null 2>&1; then
    echo "🔧 Creating buildx builder..."
    docker buildx create --name ${BUILDER_NAME} --use
    docker buildx inspect --bootstrap
else
    echo "✅ Using existing buildx builder: ${BUILDER_NAME}"
    docker buildx use ${BUILDER_NAME}
fi

# Build and push multi-architecture image
echo ""
echo "🔨 Building for multiple architectures (this may take a while)..."
echo "   This will build for both ARM64 (Raspberry Pi) and AMD64 (regular servers)"
echo ""

docker buildx build \
    --platform linux/arm64,linux/amd64 \
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
echo "✅ Successfully built and pushed multi-architecture image!"
echo "   Image: ${FULL_IMAGE_NAME}"
echo "   Platforms: linux/arm64, linux/amd64"
echo ""
echo "📝 To pull this image on any server:"
echo "   docker pull ${FULL_IMAGE_NAME}"
echo ""
echo "📝 To use in docker-compose:"
echo "   image: ${FULL_IMAGE_NAME}"
echo "   # Remove the 'build' section and use 'image' instead"

