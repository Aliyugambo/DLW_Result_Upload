const express = require('express');
const multer = require('multer');
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const File = require('../models/File');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Public file upload route - no authentication required
router.post('/upload', upload.single('file'), async (req, res) => {
    console.log('File received:', req.file);
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const newFile = new File({ filename: req.file.filename });
        await newFile.save();
        res.status(201).json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
        res.status(500).json({ message: 'File upload failed', error });
    }
});

// Admin-only download route
router.get('/download/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });

        const filePath = `uploads/${file.filename}`;
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ message: 'Error downloading file', error });
    }
});

// Admin-only edit file route
router.put('/edit/:id', authenticateToken, isAdmin, async (req, res) => {
    const { filename } = req.body;
    try {
        const file = await File.findByIdAndUpdate(req.params.id, { filename }, { new: true });
        if (!file) return res.status(404).json({ message: 'File not found' });

        res.status(200).json({ message: 'File renamed successfully', file });
    } catch (error) {
        res.status(500).json({ message: 'Error renaming file', error });
    }
});

// Fetch all files - open route
router.get('/upload', async (req, res) => {
    try {
        const files = await File.find();
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching files', error });
    }
});

module.exports = router;
