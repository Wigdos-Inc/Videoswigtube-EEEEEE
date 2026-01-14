const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (allows external repositories to upload)
app.use(cors({
  origin: '*', // Allow all origins - you can restrict this to specific domains
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));
app.use(express.json());
app.use(express.static('public'));

// Ensure videos directory exists
const videosDir = path.join(__dirname, 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'videos/');
  },
  filename: function (req, file, cb) {
    // Keep original filename
    cb(null, file.originalname);
  }
});

// File filter to accept only video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|wmv|flv|mkv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'));
  }
};

// Helper function to commit and push video
function commitAndPushVideo(filename, originalName) {
  try {
    const videoPath = path.join('videos', filename);
    const timestamp = new Date().toISOString();
    
    // Pull latest changes first to avoid conflicts
    console.log(`   📥 Pulling latest changes...`);
    execSync('git pull --rebase origin main', { cwd: __dirname, stdio: 'pipe' });
    
    // Add the video file
    execSync(`git add "${videoPath}"`, { cwd: __dirname, stdio: 'pipe' });
    
    // Commit with descriptive message
    const commitMessage = `Auto-upload: ${originalName}\n\nUploaded at: ${timestamp}\nSaved as: ${filename}`;
    execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { cwd: __dirname, stdio: 'pipe' });
    
    // Push to remote
    execSync('git push origin main', { cwd: __dirname, stdio: 'pipe' });
    
    console.log(`   🚀 Pushed to repository: ${filename}`);
    return true;
  } catch (error) {
    console.error(`   ⚠️  Git operation failed: ${error.message}`);
    return false;
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB max file size
  }
});

// Upload endpoint (accepts uploads from external sources)
app.post('/upload', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    console.log(`✅ Video uploaded: ${req.file.filename} (${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`);

    // Auto-commit and push to repository
    const pushed = commitAndPushVideo(req.file.filename, req.file.originalname);

    res.json({
      message: 'Video uploaded successfully!',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      savedTo: 'videos/' + req.file.filename,
      pushedToGit: pushed
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for external repositories (alternative endpoint)
app.post('/api/upload', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No video file uploaded' 
      });
    }

    console.log(`✅ API Upload: ${req.file.filename} from ${req.ip}`);

    // Auto-commit and push to repository
    const pushed = commitAndPushVideo(req.file.filename, req.file.originalname);

    res.json({
      success: true,
      message: 'Video uploaded successfully!',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        savedTo: 'videos/' + req.file.filename,
        uploadedAt: new Date().toISOString(),
        pushedToGit: pushed
      }
    });
  } catch (error) {
    console.error('API Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get list of uploaded videos
app.get('/videos', (req, res) => {
  fs.readdir(videosDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read videos directory' });
    }
    
    const videoFiles = files.filter(file => {
      return /\.(mp4|avi|mov|wmv|flv|mkv|webm)$/i.test(file);
    });

    res.json({ videos: videoFiles });
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Max size is 500MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: error.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ Video Upload Server Running`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Network: http://0.0.0.0:${PORT}`);
  console.log(`\n📤 API Endpoints for external uploads:`);
  console.log(`   POST /upload - Main upload endpoint`);
  console.log(`   POST /api/upload - API upload endpoint`);
  console.log(`   GET /videos - List all uploaded videos`);
  console.log(`\n📁 Videos saved to: ${videosDir}`);
});
