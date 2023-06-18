#!/bin/bash

# Run this file to start up the local development environment

# First get the current timestamp in millis to use in the docker image tag
timestamp=$(date +%s%3N)

# Build our docker images as needed with the timestamp in the tag
nerdctl --namespace=k8s.io build -t local/torrent-social-app:$timestamp ./src/app

# Set up variables
TORRENT_SOCIAL_APP_IMAGE="local/torrent-social-app:$timestamp"

# Pull the template kubernetes file and make changes as needed
k8sfile=`cat "k8s-manifest-template.yaml"`
k8sfile=`echo "$k8sfile" | sed "s#{{TORRENT_SOCIAL_APP_IMAGE}}#$TORRENT_SOCIAL_APP_IMAGE#g"`

# Finally apply the changes to kubernetes
echo "$k8sfile" | kubectl apply -f -