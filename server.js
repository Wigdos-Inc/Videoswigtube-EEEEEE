const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
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

    res.json({
      message: 'Video uploaded successfully!',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      savedTo: 'videos/' + req.file.filename
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

    res.json({
      success: true,
      message: 'Video uploaded successfully!',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        savedTo: 'videos/' + req.file.filename,
        uploadedAt: new Date().toISOString()
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
