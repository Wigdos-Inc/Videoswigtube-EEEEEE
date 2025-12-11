#!/bin/bash
# Example: Upload video using cURL

# Configuration
UPLOAD_SERVER_URL="https://cuddly-dollop-pjpjr7x7j9qxf9p7q.github.dev/api/upload"
# Or use: "http://localhost:3000/api/upload" for local testing

VIDEO_FILE="$1"

if [ -z "$VIDEO_FILE" ]; then
    echo "Usage: $0 <video-file>"
    echo "Example: $0 myvideo.mp4"
    exit 1
fi

if [ ! -f "$VIDEO_FILE" ]; then
    echo "❌ Error: File not found: $VIDEO_FILE"
    exit 1
fi

echo "📤 Uploading $VIDEO_FILE to $UPLOAD_SERVER_URL"

# Upload the video
curl -X POST "$UPLOAD_SERVER_URL" \
    -F "video=@$VIDEO_FILE" \
    -H "Accept: application/json" \
    -w "\n\n📊 Status Code: %{http_code}\n" \
    -s | jq '.'

echo "✅ Upload complete!"
