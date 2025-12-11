# Video Upload API Documentation

This server accepts video uploads from external sources and automatically stores them in the `videos/` folder.

## Base URL

```
https://cuddly-dollop-pjpjr7x7j9qxf9p7q.github.dev
```
*Or your Codespace/deployment URL*

---

## Endpoints

### 1. Upload Video (Main Endpoint)

**Endpoint:** `POST /upload`

**Description:** Upload a video file to the server.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with field name `video`

**Example (cURL):**
```bash
curl -X POST https://your-server-url.com/upload \
  -F "video=@/path/to/video.mp4"
```

**Response (Success):**
```json
{
  "message": "Video uploaded successfully!",
  "filename": "video-1702307123456-987654321.mp4",
  "originalName": "video.mp4",
  "size": 15728640,
  "path": "videos/video-1702307123456-987654321.mp4",
  "savedTo": "videos/video-1702307123456-987654321.mp4"
}
```

**Response (Error):**
```json
{
  "error": "No video file uploaded"
}
```

---

### 2. Upload Video (API Endpoint)

**Endpoint:** `POST /api/upload`

**Description:** Alternative API endpoint with structured response format.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with field name `video`

**Response (Success):**
```json
{
  "success": true,
  "message": "Video uploaded successfully!",
  "data": {
    "filename": "video-1702307123456-987654321.mp4",
    "originalName": "video.mp4",
    "size": 15728640,
    "savedTo": "videos/video-1702307123456-987654321.mp4",
    "uploadedAt": "2025-12-11T12:34:56.789Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Only video files are allowed!"
}
```

---

### 3. List Uploaded Videos

**Endpoint:** `GET /videos`

**Description:** Get a list of all uploaded videos.

**Request:**
- Method: `GET`

**Response:**
```json
{
  "videos": [
    "video-1702307123456-987654321.mp4",
    "another-video-1702307123456-123456789.mov"
  ]
}
```

---

## Supported Video Formats

- MP4 (`.mp4`)
- AVI (`.avi`)
- MOV (`.mov`)
- WMV (`.wmv`)
- FLV (`.flv`)
- MKV (`.mkv`)
- WEBM (`.webm`)

---

## File Size Limit

- Maximum file size: **500MB**

---

## CORS

The server has CORS enabled for all origins, allowing uploads from any external repository or website.

**Allowed:**
- All origins (`*`)
- Methods: `GET`, `POST`, `OPTIONS`
- Headers: `Content-Type`, `Authorization`, `X-API-Key`

---

## File Storage

- All uploaded videos are automatically saved to the `videos/` folder
- Filenames are generated with timestamps to prevent conflicts:
  - Format: `{originalName}-{timestamp}-{random}.{ext}`
  - Example: `myvideo-1702307123456-987654321.mp4`

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Upload successful |
| 400 | Bad request (no file, wrong format, file too large) |
| 500 | Server error |

---

## Integration Examples

See the `/examples` folder for:
- Python example: `upload-from-python.py`
- JavaScript/Node.js example: `upload-from-javascript.js`
- Browser/HTML example: `upload-from-browser.html`
- cURL example: `upload-with-curl.sh`

---

## Quick Integration

### From JavaScript (Browser):

```javascript
async function uploadVideo(file) {
    const formData = new FormData();
    formData.append('video', file);
    
    const response = await fetch('https://your-server/api/upload', {
        method: 'POST',
        body: formData
    });
    
    return await response.json();
}
```

### From Python:

```python
import requests

def upload_video(video_path):
    with open(video_path, 'rb') as f:
        files = {'video': f}
        response = requests.post(
            'https://your-server/api/upload',
            files=files
        )
    return response.json()
```

### From cURL:

```bash
curl -X POST https://your-server/api/upload \
  -F "video=@myvideo.mp4"
```

---

## Security Notes

- Currently accepts uploads from any source (CORS: `*`)
- No authentication required (can be added if needed)
- File type validation enforced
- File size limit: 500MB

For production use, consider adding:
- API key authentication
- Rate limiting
- Specific CORS origins
- User authentication
