#!/bin/bash
set -e

# Configuration
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-your-username}"
IMAGE_NAME="${IMAGE_NAME:-rein-art-design}"
TAG="${TAG:-staging-latest}"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "🐳 Pushing staging container to Docker Hub..."
echo "   Image: ${FULL_IMAGE_NAME}"
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

# Option 1: Tag existing running container image
echo "📋 Option 1: Tag existing container image"
echo "   This tags the image that's currently running"
echo ""
read -p "   Use existing container image? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Get the image ID from the running container
    CONTAINER_IMAGE=$(docker inspect rein-app-staging --format='{{.Image}}' 2>/dev/null || echo "")
    
    if [ -z "$CONTAINER_IMAGE" ]; then
        echo "❌ Container 'rein-app-staging' is not running"
        echo "   Building image first..."
        docker compose -f docker-compose.staging.yml build app
        CONTAINER_IMAGE=$(docker images --format "{{.ID}}" --filter "label=com.docker.compose.service=app" | head -n 1)
    fi
    
    # Tag the image
    echo "🏷️  Tagging image..."
    docker tag ${CONTAINER_IMAGE} ${FULL_IMAGE_NAME}
else
    # Option 2: Build fresh and tag
    echo "🔨 Building fresh image..."
    docker compose -f docker-compose.staging.yml build app
    
    # Get the image ID
    CONTAINER_IMAGE=$(docker images --format "{{.ID}}" --filter "label=com.docker.compose.service=app" | head -n 1)
    
    if [ -z "$CONTAINER_IMAGE" ]; then
        # Alternative: find by image name pattern
        CONTAINER_IMAGE=$(docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | grep "rein-art-design.*staging" | head -n 1 | awk '{print $2}')
    fi
    
    echo "🏷️  Tagging image..."
    docker tag ${CONTAINER_IMAGE} ${FULL_IMAGE_NAME}
fi

# Show image info
echo ""
echo "📦 Image details:"
docker images ${FULL_IMAGE_NAME}

# Confirm push
echo ""
read -p "🚀 Push to Docker Hub? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⬆️  Pushing to Docker Hub..."
    docker push ${FULL_IMAGE_NAME}
    
    echo ""
    echo "✅ Successfully pushed to Docker Hub!"
    echo "   Image: ${FULL_IMAGE_NAME}"
    echo ""
    echo "📝 To pull this image on another server:"
    echo "   docker pull ${FULL_IMAGE_NAME}"
    echo ""
    echo "📝 To use in docker-compose:"
    echo "   image: ${FULL_IMAGE_NAME}"
    echo ""
    echo "⚠️  Note: This image is built for ARM64 (Raspberry Pi)"
    echo "   For AMD64 servers, you'll need to build with:"
    echo "   docker buildx build --platform linux/amd64 -t ${FULL_IMAGE_NAME}-amd64 ."
else
    echo "❌ Push cancelled"
    echo "   Image tagged as: ${FULL_IMAGE_NAME}"
    echo "   Push manually with: docker push ${FULL_IMAGE_NAME}"
fi

