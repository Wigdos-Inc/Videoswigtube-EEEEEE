/**
 * Example: Upload video from JavaScript/Node.js to the video upload server
 */

// For Node.js
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch'); // npm install node-fetch@2

// Configuration
const UPLOAD_SERVER_URL = 'https://cuddly-dollop-pjpjr7x7j9qxf9p7q.github.dev/api/upload';
// Or use: 'http://localhost:3000/api/upload' for local testing

/**
 * Upload a video file to the server
 * @param {string} videoPath - Path to the video file
 * @returns {Promise<Object>} - Server response
 */
async function uploadVideo(videoPath) {
    try {
        // Create form data
        const formData = new FormData();
        
        // Append the video file
        const fileStream = fs.createReadStream(videoPath);
        formData.append('video', fileStream);
        
        console.log(`📤 Uploading ${videoPath}...`);
        
        // Send POST request
        const response = await fetch(UPLOAD_SERVER_URL, {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Upload successful!');
            console.log(`   Saved as: ${result.data.filename}`);
            console.log(`   Size: ${result.data.size} bytes`);
            return result;
        } else {
            console.log(`❌ Upload failed: ${response.status}`);
            console.log(`   Error: ${result.error}`);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Error uploading video:', error.message);
        return null;
    }
}

// Example usage
if (require.main === module) {
    const videoFile = 'example.mp4'; // Replace with your video file
    
    uploadVideo(videoFile)
        .then(result => {
            if (result) {
                console.log('\n📋 Full response:');
                console.log(JSON.stringify(result, null, 2));
            }
        });
}

module.exports = { uploadVideo };
