#!/bin/bash

# Abort on any error
set -e

# Build your site if needed (optional)
# echo "Building site..."
# npm run build

# Path to your built static files
SOURCE_DIR="/home/ubuntu/my-app/apps/website/dist"
TARGET_DIR="/var/www/temp.adexperiences.com"

echo "Deploying site to $TARGET_DIR..."

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Copy all files (preserves structure, replaces existing)
rsync -av --delete "$SOURCE_DIR/" "$TARGET_DIR/"

# Set correct permissions (readable by NGINX)
chmod -R o+rX "$TARGET_DIR"

echo "✅ Deployment complete!"
