import multer from 'multer';

// Use memory storage for processing file buffers in memory (e.g. PDF parsing)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export default upload;
