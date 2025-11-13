#!/bin/bash
# Wrapper script to automatically use .env.staging with docker compose
# Usage: ./scripts/docker-compose-staging.sh [docker compose commands]
# Example: ./scripts/docker-compose-staging.sh up -d
# Example: ./scripts/docker-compose-staging.sh logs -f app

docker compose --env-file .env.staging -f docker-compose.staging.yml "$@"

