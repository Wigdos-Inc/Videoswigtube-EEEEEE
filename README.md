# Video Upload Application

A simple web application for uploading and managing video files.

## Features

- 📤 Drag & drop or click to upload videos
- 📊 Real-time upload progress tracking
- 📁 Automatic storage in the `videos/` folder
- 📋 List of all uploaded videos
- 🎨 Beautiful, responsive UI

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Supported Video Formats

- MP4
- AVI
- MOV
- WMV
- FLV
- MKV
- WEBM

## Configuration

- **Max file size**: 500MB (configurable in `server.js`)
- **Upload directory**: `videos/` (created automatically)
- **Port**: 3000 (or set via `PORT` environment variable)
