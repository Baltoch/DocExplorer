import express from 'express';
import multer from 'multer';
import * as Minio from 'minio';
import stream from 'stream';

const router = express.Router();

// Initialize MinIO client
const minioClient = new Minio.Client({
    endPoint: 'filestorage',
    port: parseInt(process.env.FILE_STORAGE_PORT) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin'
});

// Middleware to handle file uploads
const upload = multer();

// Upload a file to MinIO
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const objectName = req.file.originalname;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    minioClient.putObject(process.env.MINIO_BUCKET_NAME || 'docexplorer', objectName, bufferStream, req.file.size, (err, etag) => {
        res.json({
            message: 'File uploaded successfully',
            etag: etag
        });
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download a file from MinIO
router.get('/:objectName', async (req, res) => {
  try {
    const objectName = req.params.objectName;
    const objectStream = await minioClient.getObject(process.env.MINIO_BUCKET_NAME || 'docexplorer', objectName);

    objectStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download a file from MinIO
router.get('/download/:objectName', async (req, res) => {
  try {
    const objectName = req.params.objectName;
    const objectStream = await minioClient.getObject(process.env.MINIO_BUCKET_NAME || 'docexplorer', objectName);
    res.setHeader("Content-Disposition", "attachment");
    objectStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List objects in MinIO bucket
router.get('/', async (req, res) => {
  try {
    const objects = [];
    const stream = minioClient.listObjects(process.env.MINIO_BUCKET_NAME || 'docexplorer', '');

    stream.on('data', (obj) => {
      objects.push(obj);
    });

    stream.on('end', () => {
      res.json(objects);
    });
  } catch (error) {
    console.error('Error listing objects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a file from MinIO
router.delete('/:objectName', async (req, res) => {
  try {
    const objectName = req.params.objectName;
    await minioClient.removeObject(process.env.MINIO_BUCKET_NAME || 'docexplorer', objectName);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;