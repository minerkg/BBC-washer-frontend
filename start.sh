#!/bin/bash

# Check if an argument was provided
if [[ $# -ne 1 ]]; then
  echo "❌ Error: Missing argument"
  echo "Usage: bash start.sh [dev|prod]"
  exit 1
fi

MODE=$1

# Validate the mode argument
if [[ "$MODE" != "dev" && "$MODE" != "prod" ]]; then
  echo "❌ Invalid mode: $MODE"
  echo "Usage: bash start.sh [dev|prod]"
  echo "  dev  - Run with development config (API on 8081)"
  echo "  prod - Run with production config (API on 8082)"
  exit 1
fi

# Run Angular accordingly
if [[ "$MODE" == "dev" ]]; then
  echo "🚀 Starting Angular in DEV mode (API on port 8081)"
  ng serve
elif [[ "$MODE" == "prod" ]]; then
  echo "🚀 Starting Angular in PROD mode (API on port 8082)"
  ng serve --configuration=production
fi
