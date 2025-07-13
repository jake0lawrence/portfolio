#!/usr/bin/env bash
set -euxo pipefail

# Log everything for debugging
exec > >(tee -a /var/log/portfolio-deploy.log) 2>&1

REPO_DIR=/var/www/jakelawrence.io
PNPM=/usr/local/bin/pnpm

echo "🚀  Deploy started at $(date -u)"

# Environment info
echo "Working directory: $REPO_DIR"
node --version
"$PNPM" --version
pm2 list

# Sync code and keep previous build intact
git -C "$REPO_DIR" fetch --all
git -C "$REPO_DIR" reset --hard origin/main
git -C "$REPO_DIR" clean -fd -e .next

cd "$REPO_DIR"
"$PNPM" install --silent

# Build into temporary directory
BUILD_DIR=.next-temp
rm -rf "$BUILD_DIR"
NEXT_BUILD_DIR="$BUILD_DIR" "$PNPM" build

# Swap directories only if build succeeded
if [ -d "$BUILD_DIR" ]; then
  rm -rf .next.bak
  mv .next .next.bak || true
  mv "$BUILD_DIR" .next
  rm -rf .next.bak
fi

# Reload or start PM2
if pm2 describe portfolio >/dev/null 2>&1; then
  pm2 reload portfolio --update-env
else
  pm2 start "$PNPM" --name portfolio --cwd "$REPO_DIR" -- start
fi

pm2 save

echo "✅  Deploy finished at $(date -u)"
