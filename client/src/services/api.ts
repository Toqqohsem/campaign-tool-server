// client/src/services/api.ts
import axios from 'axios';

const baseURL = 'http://54.169.244.206:3001/api';  // Add /api here

export const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

// Mock/Placeholder implementations for components to use
export const creativeAssetApi = {
  getUploadUrl: (filename: string, contentType: string) => 
    api.post('/s3/upload-url', { filename, contentType }),
};

export const uploadToS3 = (file: File, uploadUrl: string) => {
  return axios.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type },
  });
};

export const mlApi = {
  getRecommendations: (campaignId?: string) => 
    api.get('/ml/recommendations', { params: { campaign_id: campaignId } }),
};