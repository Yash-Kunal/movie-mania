#!/bin/bash

# Exit on error
set -e

# Install dependencies
npm ci

# Build the app
npm run build

# Done!
echo "Build completed successfully!"