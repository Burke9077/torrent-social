#!/bin/bash

# Run this file to start up the local development environment

# Build our docker images as needed
nerdctl --namespace=k8s.io build -t local/torrent-social-app:latest ./src/app

# Finally apply the changes to kubernetes
kubectl apply -f ./k8s-localdev.yaml