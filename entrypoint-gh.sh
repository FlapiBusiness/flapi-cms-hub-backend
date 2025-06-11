#!/bin/bash

set -e

# Check if the Github token is defined
if [ -z "$GITHUB_WEBHOOK_ACCESS_TOKEN" ]; then
  echo "Error: The environment variable GITHUB_WEBHOOK_ACCESS_TOKEN is not defined."
  sleep infinity
fi

# Auth
echo "$GITHUB_WEBHOOK_ACCESS_TOKEN" | gh auth login --with-token || {
  echo "GH auth failed"
  sleep infinity
}

# Install extension if missing
gh extension list | grep cli/gh-webhook > /dev/null || gh extension install cli/gh-webhook

# Start forwarding webhooks
echo "Starting webhook forwarding..."
gh webhook forward --org="$GITHUB_USERNAME_OR_ORGANIZATION" --events=workflow_run --url=http://host.docker.internal:3556/webhook || {
  echo "Webhook forwarding failed"
  sleep infinity
}