// server/src/routes/analytics.ts
import { Router } from 'express';
import { query } from '../db';
import { generateMLRecommendations } from '../utils/mlModel';

export const analyticsRoutes = Router();

// 🚀 CORE AI INSIGHTS - Your Main Differentiator (DEBUG VERSION)
analyticsRoutes.get('/ai-insights/:campaign_id', async (req, res) => {
  try {
    const { campaign_id } = req.params;
    console.log('Campaign ID:', campaign_id);
    
    // Test database connection first
    const testQuery = await query('SELECT COUNT(*) FROM campaigns');
    console.log('Database connection test:', testQuery.rows);
    
    // Get campaign data step by step
    const campaignData = await query('SELECT * FROM campaigns WHERE id = $1', [campaign_id]);
    console.log('Campaign data:', campaignData.rows);
    
    if (campaignData.rows.length === 0) {
      const availableCampaigns = await query('SELECT id, name FROM campaigns LIMIT 5');
      return res.json({ 
        error: 'Campaign not found',
        availableCampaigns: availableCampaigns.rows
      });
    }
    
    const leadsData = await query('SELECT * FROM leads WHERE campaign_id = $1', [campaign_id]);
    console.log('Leads count:', leadsData.rows.length);
    
    const personasData = await query('SELECT * FROM personas WHERE campaign_id = $1', [campaign_id]);
    console.log('Personas count:', personasData.rows.length);

    const campaign = campaignData.rows[0];
    const leads = leadsData.rows;
    const personas = personasData.rows;

    // Simple AI insights without complex calculations
    const aiInsights = {
      basicStats: {
        totalLeads: leads.length,
        avgConversionScore: leads.length > 0 ? 
          Math.round((leads.reduce((sum: number, l: any) => sum + (l.predicted_conversion_likelihood || 0), 0) / leads.length) * 100) / 100 : 0,
        highValueLeads: leads.filter((l: any) => (l.predicted_conversion_likelihood || 0) > 0.7).length,
        hotLeads: leads.filter((l: any) => l.status === 'Hot').length
      },
      predictions: {
        totalPotentialValue: leads.reduce((sum: number, l: any) => sum + (l.budget_max || 0), 0),
        predictedRevenue: Math.round(leads.reduce((sum: number, l: any) => sum + ((l.budget_max || 0) * (l.predicted_conversion_likelihood || 0)), 0)),
        roi: campaign.budget ? Math.round(((leads.reduce((sum: number, l: any) => sum + ((l.budget_max || 0) * (l.predicted_conversion_likelihood || 0)), 0) - campaign.budget) / campaign.budget) * 100) : 0
      },
      mlRecommendations: leads.length > 0 ? generateMLRecommendations(leads) : []
    };

    res.json({
      success: true,
      campaign: campaign.name,
      aiInsights,
      generatedAt: new Date().toISOString()
    });

  } catch (err: any) {
    console.error('Detailed error:', err);
    res.status(500).json({ 
      message: 'Error generating AI insights',
      error: err.message,
      stack: err.stack
    });
  }
});

// 🔍 SIMPLE TEST ENDPOINT
analyticsRoutes.get('/test', async (req, res) => {
  try {
    const campaigns = await query('SELECT id, name FROM campaigns LIMIT 3');
    const leads = await query('SELECT COUNT(*) as count FROM leads');
    
    res.json({
      message: 'Analytics API is working!',
      availableCampaigns: campaigns.rows,
      totalLeads: leads.rows[0].count
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});