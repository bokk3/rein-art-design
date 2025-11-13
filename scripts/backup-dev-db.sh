#!/bin/bash
set -e

echo "💾 Creating backup of dev database..."

# Check if dev containers are running
if ! docker ps | grep -q "rein-postgres"; then
    echo "❌ Dev database container (rein-postgres) is not running"
    echo "   Start it with: docker compose up -d postgres"
    exit 1
fi

# Detect database name from container or use defaults
DB_NAME=$(docker compose exec -T postgres psql -U postgres -t -c "SELECT datname FROM pg_database WHERE datname NOT IN ('template0', 'template1', 'postgres') ORDER BY datname LIMIT 1;" 2>/dev/null | xargs || echo "")

if [ -z "$DB_NAME" ]; then
    # Try common database names
    for db in "rein" "nextjs_cms"; do
        if docker compose exec -T postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw "$db"; then
            DB_NAME="$db"
            break
        fi
    done
fi

if [ -z "$DB_NAME" ]; then
    echo "❌ Could not detect database name. Please specify with: DB_NAME=your_db_name ./scripts/backup-dev-db.sh"
    echo "   Available databases:"
    docker compose exec -T postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -v template | grep -v postgres
    exit 1
fi

echo "📊 Found database: $DB_NAME"

# Create backups directory if it doesn't exist
mkdir -p backups

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/backup_dev_${TIMESTAMP}.sql"

echo "📦 Creating backup: $BACKUP_FILE"

# Create SQL dump
if docker compose exec -T postgres pg_dump -U postgres -d "$DB_NAME" --clean --if-exists --no-owner --no-acl > "$BACKUP_FILE"; then
    # Get file size
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup created successfully!"
    echo "   File: $BACKUP_FILE"
    echo "   Size: $FILE_SIZE"
    echo ""
    echo "📝 To use this backup for staging deployment:"
    echo "   cp $BACKUP_FILE database.bak"
    echo "   # or"
    echo "   cp $BACKUP_FILE backup_db.bak"
    echo ""
    echo "   Then run: ./scripts/deploy-staging.sh"
    
    # Also create a symlink or copy as database.bak for easy access
    if [ -f "$BACKUP_FILE" ]; then
        # Optionally create a latest symlink
        LATEST_BACKUP="backups/backup_dev_latest.sql"
        cp "$BACKUP_FILE" "$LATEST_BACKUP"
        echo "   Also saved as: $LATEST_BACKUP"
    fi
else
    echo "❌ Backup failed!"
    rm -f "$BACKUP_FILE"
    exit 1
fi

