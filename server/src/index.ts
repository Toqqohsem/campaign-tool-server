import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { campaignRoutes } from './routes/campaigns';
import { personaRoutes } from './routes/personas';
import { leadRoutes } from './routes/leads';
import { creativeAssetRoutes } from './routes/assets';
import { adCopyRoutes } from './routes/adcopy';
import { mlRoutes } from './routes/ml';
import { s3Routes } from './routes/s3';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/creative-assets', creativeAssetRoutes);
app.use('/api/ad-copy', adCopyRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/s3', s3Routes);

app.get('/api/health', (req, res) => {
  res.status(200).send('Backend is healthy!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});