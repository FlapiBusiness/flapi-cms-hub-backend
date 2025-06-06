#!/bin/bash

# Check if the Github token is defined
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
  echo "Error: The environment variable github_personal_access_token is not defined."
  exit 1
fi

# Configure GH authentication
echo "$GITHUB_PERSONAL_ACCESS_TOKEN" | gh auth login --with-token

# Check if the GH Webhook Forward extension is installed, if not, install it
gh extension list | grep cli/gh-webhook > /dev/null || gh extension install cli/gh-webhook


# Execute the GH Webhook Forward command
gh webhook forward --org=webhook-git --events=workflow_run --url=http://host.docker.internal:3333/webhook
