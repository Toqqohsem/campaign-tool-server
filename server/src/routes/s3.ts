// server/src/routes/s3.ts

import { Router } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3Routes = Router();

const s3Client = new S3Client({ region: process.env.AWS_REGION });

s3Routes.post('/upload-url', async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    const bucketName = process.env.AWS_S3_BUCKET;

    if (!bucketName) {
      return res.status(500).json({ message: 'S3 bucket name not configured' });
    }

    const key = `assets/${Date.now()}-${filename}`; // Unique key for the file

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Generate a presigned URL for a PUT request
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ uploadUrl, fileUrl });
  } catch (err) {
    console.error('Error generating S3 upload URL:', err);
    res.status(500).json({ message: 'Error generating S3 upload URL' });
  }
});