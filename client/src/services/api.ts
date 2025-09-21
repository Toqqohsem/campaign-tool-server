// client/src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_AWS_API_GATEWAY_URL || 'http://localhost:3001/api',
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