#!/bin/bash
# Create minimal valid PNG files as placeholders
# These are 1x1 pixel purple PNG files

# Base64 encoded 1x1 purple PNG
BASE64_PNG="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

for size in 16 48 128; do
  echo "$BASE64_PNG" | base64 -d > "icon${size}.png"
  echo "Created icon${size}.png"
done
