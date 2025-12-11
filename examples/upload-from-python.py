#!/usr/bin/env python3
"""
Example: Upload video from Python to the video upload server
"""

import requests
import os

# Configuration
UPLOAD_SERVER_URL = "https://cuddly-dollop-pjpjr7x7j9qxf9p7q.github.dev/api/upload"
# Or use: "http://localhost:3000/api/upload" for local testing

def upload_video(video_path):
    """
    Upload a video file to the server
    
    Args:
        video_path: Path to the video file to upload
    
    Returns:
        Response from the server
    """
    if not os.path.exists(video_path):
        print(f"❌ Error: File not found: {video_path}")
        return None
    
    try:
        # Open the video file
        with open(video_path, 'rb') as video_file:
            # Prepare the file for upload
            files = {
                'video': (os.path.basename(video_path), video_file, 'video/mp4')
            }
            
            print(f"📤 Uploading {os.path.basename(video_path)}...")
            
            # Send POST request
            response = requests.post(UPLOAD_SERVER_URL, files=files)
            
            # Check response
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Upload successful!")
                print(f"   Saved as: {result['data']['filename']}")
                print(f"   Size: {result['data']['size']} bytes")
                return result
            else:
                print(f"❌ Upload failed: {response.status_code}")
                print(f"   Error: {response.text}")
                return None
                
    except Exception as e:
        print(f"❌ Error uploading video: {str(e)}")
        return None

# Example usage
if __name__ == "__main__":
    # Replace with your video file path
    video_file = "example.mp4"
    
    result = upload_video(video_file)
    
    if result:
        print("\n📋 Full response:")
        print(result)
