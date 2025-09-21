import { Router } from 'express';
import { calculateLeadScore, generateMLRecommendations } from '../utils/mlModel';
import { query } from '../db';
import { Lead } from '../types';

export const mlRoutes = Router();

mlRoutes.post('/score-lead', async (req, res) => {
  try {
    const leadData = req.body;
    const { score, segment } = calculateLeadScore(leadData as Lead);
    res.json({ score, segment });
  } catch (err) {
    console.error('Error scoring lead:', err);
    res.status(500).json({ message: 'Error scoring lead' });
  }
});

mlRoutes.get('/recommendations', async (req, res) => {
  try {
    const { campaign_id } = req.query;
    let leads: Lead[] = [];
    if (campaign_id) {
      const { rows } = await query('SELECT * FROM leads WHERE campaign_id = $1', [campaign_id]);
      leads = rows;
    } else {
      const { rows } = await query('SELECT * FROM leads');
      leads = rows;
    }
    
    const recommendations = generateMLRecommendations(leads);
    res.json({ recommendations });
  } catch (err) {
    console.error('Error generating ML recommendations:', err);
    res.status(500).json({ message: 'Error generating ML recommendations' });
  }
});
