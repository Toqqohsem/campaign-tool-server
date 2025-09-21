// 🚀 DEMO ENDPOINT WITH MOCK DATA (for AWS event)
analyticsRoutes.get('/demo-insights/:campaign_id', async (req, res) => {
  res.json({
    success: true,
    campaign: "Luxury Condos Downtown - AWS Demo",
    aiInsights: {
      basicStats: {
        totalLeads: 47,
        avgConversionScore: 0.68,
        highValueLeads: 12,
        hotLeads: 8
      },
      predictions: {
        totalPotentialValue: 28500000,
        predictedRevenue: 19380000,
        roi: 287
      },
      mlRecommendations: [
        "Focus on 12 high-value leads with 70%+ conversion probability",
        "Immediate follow-up needed for 8 hot leads", 
        "Highlight premium features for 5 luxury buyers",
        "Schedule follow-up calls with 15 leads who visited the site"
      ]
    },
    awsServices: {
      compute: "EC2 - Auto-scaling API server",
      storage: "S3 - Asset management", 
      database: "RDS - PostgreSQL with ML data",
      ai: "Custom ML Model - Real-time predictions"
    },
    generatedAt: new Date().toISOString()
  });
});
