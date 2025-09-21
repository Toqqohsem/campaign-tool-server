"use strict";
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
exports.analyticsRoutes = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const advancedML_1 = require("../utils/advancedML");
exports.analyticsRoutes = (0, express_1.Router)();
// 🚀 CORE AI INSIGHTS - Your Main Differentiator
exports.analyticsRoutes.get('/ai-insights/:campaign_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.params;
        // Get all campaign data
        const [campaignData, leadsData, personasData] = yield Promise.all([
            (0, db_1.query)('SELECT * FROM campaigns WHERE id = $1', [campaign_id]),
            (0, db_1.query)('SELECT * FROM leads WHERE campaign_id = $1', [campaign_id]),
            (0, db_1.query)('SELECT * FROM personas WHERE campaign_id = $1', [campaign_id])
        ]);
        const campaign = campaignData.rows[0];
        const leads = leadsData.rows;
        const personas = personasData.rows;
        // 🧠 AI-POWERED INSIGHTS
        const aiInsights = {
            // Predictive Buying Insights
            buyingPredictions: (0, advancedML_1.generateBuyingInsights)(leads),
            // Customer Journey Analysis
            journeyAnalysis: (0, advancedML_1.predictCustomerJourney)(leads),
            // Real Estate Market Intelligence
            marketIntelligence: generateMarketIntelligence(leads),
            // Persona Performance AI
            personaAI: generatePersonaAI(leads, personas),
            // Revenue Prediction
            revenueForecast: generateRevenueForecast(leads, campaign.budget),
            // Next Best Actions (AI Recommendations)
            nextBestActions: generateNextBestActions(leads)
        };
        res.json({
            campaign: campaign.name,
            totalLeads: leads.length,
            aiInsights,
            generatedAt: new Date().toISOString()
        });
    }
    catch (err) {
        console.error('Error generating AI insights:', err);
        res.status(500).json({ message: 'Error generating AI insights' });
    }
}));
// 📊 PREDICTIVE DASHBOARD DATA
exports.analyticsRoutes.get('/predictive-dashboard/:campaign_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.params;
        // Advanced SQL Analytics
        const dashboardData = yield (0, db_1.query)(`
      WITH lead_metrics AS (
        SELECT 
          buyer_segment,
          status,
          predicted_conversion_likelihood,
          budget_max,
          age_range,
          income_bracket,
          property_type,
          EXTRACT(DAY FROM NOW() - created_at) as days_in_pipeline
        FROM leads 
        WHERE campaign_id = $1
      ),
      conversion_predictions AS (
        SELECT 
          buyer_segment,
          COUNT(*) as total_leads,
          AVG(predicted_conversion_likelihood) as avg_likelihood,
          COUNT(CASE WHEN status = 'Converted' THEN 1 END) as actual_conversions,
          AVG(budget_max) as avg_budget,
          SUM(budget_max) as total_potential_value
        FROM lead_metrics
        GROUP BY buyer_segment
      ),
      journey_stages AS (
        SELECT 
          status,
          COUNT(*) as count,
          AVG(predicted_conversion_likelihood) as avg_score,
          AVG(days_in_pipeline) as avg_days
        FROM lead_metrics
        GROUP BY status
      )
      SELECT 
        json_build_object(
          'conversionPredictions', (SELECT json_agg(conversion_predictions) FROM conversion_predictions),
          'journeyStages', (SELECT json_agg(journey_stages) FROM journey_stages),
          'totalPotentialValue', (SELECT SUM(total_potential_value) FROM conversion_predictions),
          'highValueLeads', (SELECT COUNT(*) FROM lead_metrics WHERE predicted_conversion_likelihood > 0.8),
          'urgentFollowUps', (SELECT COUNT(*) FROM lead_metrics WHERE status = 'Hot' AND days_in_pipeline > 7)
        ) as dashboard_data
    `, [campaign_id]);
        res.json(dashboardData.rows[0].dashboard_data);
    }
    catch (err) {
        console.error('Error generating predictive dashboard:', err);
        res.status(500).json({ message: 'Error generating predictive dashboard' });
    }
}));
// 🎯 REAL-TIME LEAD SCORING WITH AI
exports.analyticsRoutes.get('/realtime-scoring/:campaign_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.params;
        const realtimeData = yield (0, db_1.query)(`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        status,
        predicted_conversion_likelihood,
        buyer_segment,
        budget_max,
        created_at,
        CASE 
          WHEN predicted_conversion_likelihood > 0.8 THEN 'IMMEDIATE_ACTION'
          WHEN predicted_conversion_likelihood > 0.6 THEN 'HIGH_PRIORITY'
          WHEN predicted_conversion_likelihood > 0.4 THEN 'MEDIUM_PRIORITY'
          ELSE 'LOW_PRIORITY'
        END as ai_priority,
        CASE 
          WHEN status = 'Hot' AND predicted_conversion_likelihood > 0.7 THEN 'Call within 1 hour'
          WHEN status = 'Site Visit' AND predicted_conversion_likelihood > 0.6 THEN 'Follow up within 24 hours'
          WHEN buyer_segment = 'Luxury Buyer' THEN 'Assign to senior agent'
          WHEN buyer_segment = 'First-time Buyer' THEN 'Provide educational materials'
          ELSE 'Standard follow-up'
        END as ai_recommendation
      FROM leads 
      WHERE campaign_id = $1
      ORDER BY predicted_conversion_likelihood DESC, created_at DESC
    `, [campaign_id]);
        res.json({
            leads: realtimeData.rows,
            summary: {
                immediateAction: realtimeData.rows.filter(l => l.ai_priority === 'IMMEDIATE_ACTION').length,
                highPriority: realtimeData.rows.filter(l => l.ai_priority === 'HIGH_PRIORITY').length,
                totalValue: realtimeData.rows.reduce((sum, l) => sum + l.budget_max, 0)
            }
        });
    }
    catch (err) {
        console.error('Error generating realtime scoring:', err);
        res.status(500).json({ message: 'Error generating realtime scoring' });
    }
}));
// 📈 CAMPAIGN PERFORMANCE PREDICTION
exports.analyticsRoutes.get('/performance-prediction/:campaign_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.params;
        const performanceData = yield (0, db_1.query)(`
      WITH daily_metrics AS (
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as daily_leads,
          AVG(predicted_conversion_likelihood) as daily_avg_score,
          COUNT(CASE WHEN status = 'Converted' THEN 1 END) as daily_conversions
        FROM leads 
        WHERE campaign_id = $1
        GROUP BY DATE(created_at)
        ORDER BY date
      )
      SELECT 
        json_build_object(
          'dailyTrends', (SELECT json_agg(daily_metrics) FROM daily_metrics),
          'projectedConversions', (
            SELECT 
              ROUND(
                (SELECT AVG(daily_conversions) FROM daily_metrics) * 
                (SELECT EXTRACT(DAY FROM end_date - NOW()) FROM campaigns WHERE id = $1)
              ) as projected_conversions
          ),
          'projectedRevenue', (
            SELECT 
              ROUND(
                AVG(budget_max * predicted_conversion_likelihood) * 
                COUNT(*)
              ) as projected_revenue
            FROM leads WHERE campaign_id = $1
          )
        ) as performance_prediction
    `, [campaign_id]);
        res.json(performanceData.rows[0].performance_prediction);
    }
    catch (err) {
        console.error('Error generating performance prediction:', err);
        res.status(500).json({ message: 'Error generating performance prediction' });
    }
}));
