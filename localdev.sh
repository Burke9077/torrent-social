#!/bin/bash

# Run this file to start up the local development environment

# Set up variables
export DEPLOY_ENV="${DEPLOY_ENV:-local}"
export TORRENT_SOCIAL_APP_IMAGE="local/torrent-social-app:$timestamp"

# Find or create the mysql configuration
export DB_HOST="${DB_HOST:-primarydb}"
export DB_USER="${DB_USER:-$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c12)}" # Take the username or generate a random one
export DB_PASS="${DB_PASS:-$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c12)}" # Take the password or generate a random one
export DB_NAME="${ENVIRONMENT_VARIABLE_NAME:-torrent_social}"
export DB_ROOT_PW="${DB_ROOT_PW:-$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c12)}" # Take the password or generate a random one

# Build our docker images as needed with the timestamp in the tag
timestamp=$(date +%s%3N)
nerdctl --namespace=k8s.io build -t local/torrent-social-app:$timestamp ./src/app

# Add database configuration if this is not production
if [ "$DEPLOY_ENV" != "production" ]; then
  export MYSQL_DB_K8S_MANIFEST=`envsubst < ./src/deploy/non-prod/k8s-mysql.yaml`
fi

# Pull the template kubernetes file and make changes as needed
k8sfile=`envsubst < ./src/deploy/k8s-manifest.yaml`

# Finally apply the changes to kubernetes
echo "$k8sfile" | kubectl apply -f -