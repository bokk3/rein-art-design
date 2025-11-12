#!/bin/bash
set -e

# Helper script to prepare a release by updating package.json version and creating a git tag
# This ensures version consistency between package.json and git tags

# Read current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current package.json version: $CURRENT_VERSION"
echo ""

# Ask for new version
read -p "Enter new version (current: $CURRENT_VERSION, or press Enter to keep current): " NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
    NEW_VERSION=$CURRENT_VERSION
    echo "✅ Keeping current version: $NEW_VERSION"
else
    # Update package.json version
    echo "🔄 Updating package.json to version $NEW_VERSION..."
    npm version $NEW_VERSION --no-git-tag
    echo "✅ Package.json updated"
fi

# Ask if staging or production
echo ""
read -p "Is this a staging release? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    TAG="v${NEW_VERSION}-staging"
    ENV_TYPE="staging"
    echo "🏷️  Creating staging tag: $TAG"
else
    TAG="v${NEW_VERSION}"
    ENV_TYPE="production"
    echo "🏷️  Creating production tag: $TAG"
fi

# Check if tag already exists
if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "⚠️  Tag $TAG already exists!"
    read -p "   Do you want to delete and recreate it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d "$TAG" 2>/dev/null || true
        git push origin ":refs/tags/$TAG" 2>/dev/null || true
        echo "✅ Old tag deleted"
    else
        echo "❌ Cancelled"
        exit 1
    fi
fi

# Show what will be committed
echo ""
echo "📋 Summary:"
echo "   Version: $NEW_VERSION"
echo "   Tag: $TAG"
echo "   Environment: $ENV_TYPE"
echo ""

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected:"
    git status --short
    echo ""
    read -p "   Commit these changes with the version bump? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add package.json package-lock.json
        git commit -m "chore: bump version to $NEW_VERSION"
        echo "✅ Changes committed"
    else
        echo "⚠️  Skipping commit - make sure to commit manually before pushing tag"
    fi
fi

# Create tag
echo ""
read -p "🚀 Create and push tag $TAG? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git tag $TAG
    echo "✅ Tag created locally: $TAG"
    
    # Push tag
    read -p "   Push tag to remote? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin $TAG
        echo "✅ Tag pushed to remote"
        
        # Push commits if any
        if [ -n "$(git log origin/$(git branch --show-current)..HEAD)" ]; then
            read -p "   Push commits to remote? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git push origin HEAD
                echo "✅ Commits pushed"
            fi
        fi
        
        echo ""
        echo "🎉 Release prepared successfully!"
        echo "   Version: $NEW_VERSION"
        echo "   Tag: $TAG"
        echo "   Environment: $ENV_TYPE"
        echo ""
        echo "🚀 GitHub Actions will now build and push the Docker image"
        echo "   Image tags: your-username/rein-art-design:${ENV_TYPE}-${NEW_VERSION}"
    else
        echo "✅ Tag created locally (not pushed)"
        echo "   Push manually with: git push origin $TAG"
    fi
else
    echo "❌ Tag creation cancelled"
    echo "   Create manually with: git tag $TAG"
fi

