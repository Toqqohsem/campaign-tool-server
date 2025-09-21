"use strict";
// server/src/routes/s3.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Routes = void 0;
const express_1 = require("express");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
exports.s3Routes = (0, express_1.Router)();
const s3Client = new client_s3_1.S3Client({ region: process.env.AWS_REGION });
exports.s3Routes.post('/upload-url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, contentType } = req.body;
        const bucketName = process.env.AWS_S3_BUCKET;
        if (!bucketName) {
            return res.status(500).json({ message: 'S3 bucket name not configured' });
        }
        const key = `assets/${Date.now()}-${filename}`; // Unique key for the file
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: contentType,
        });
        // Generate a presigned URL for a PUT request
        const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
        const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        res.json({ uploadUrl, fileUrl });
    }
    catch (err) {
        console.error('Error generating S3 upload URL:', err);
        res.status(500).json({ message: 'Error generating S3 upload URL' });
    }
}));
