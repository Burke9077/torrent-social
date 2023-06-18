#!/bin/bash

# Run this file to start up the local development environment

# First get the current timestamp in millis to use in the docker image tag
timestamp=$(date +%s%3N)

# Build our docker images as needed with the timestamp in the tag
nerdctl --namespace=k8s.io build -t local/torrent-social-app:$timestamp ./src/app

# Set up variables
export TORRENT_SOCIAL_APP_IMAGE="local/torrent-social-app:$timestamp"

# Find or create the mysql configuration
export DB_HOST="${DB_HOST:-primarydb}"
export DB_USER="${DB_USER:-$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c12)}" # Take the username or generate a random one
export DB_PASS="${DB_PASS:-$(< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c12)}" # Take the password or generate a random one
export DB_NAME="${ENVIRONMENT_VARIABLE_NAME:-torrent_social}"

# Pull the template kubernetes file and make changes as needed
k8sfile=`envsubst < k8s-manifest-template.yaml`

# Finally apply the changes to kubernetes
echo "$k8sfile" | kubectl apply -f -