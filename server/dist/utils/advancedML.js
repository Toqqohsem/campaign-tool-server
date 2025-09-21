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
        // 🧠 AI-POWERED INSIGHTS (Built-in functions)
        const aiInsights = {
            // Predictive Buying Insights
            buyingPredictions: {
                highValueLeads: leads.filter(l => l.predicted_conversion_likelihood > 0.7).length,
                urgentFollowUps: leads.filter(l => l.status === 'Hot').length,
                conversionForecast: Math.round(leads.reduce((sum, l) => sum + l.predicted_conversion_likelihood, 0)),
                optimalPricePoint: Math.round(leads.reduce((sum, l) => sum + l.budget_max, 0) / leads.length)
            },
            // Customer Journey Analysis
            journeyAnalysis: {
                stageDistribution: getStageDistribution(leads),
                avgConversionTime: calculateAvgConversionTime(leads),
                bottlenecks: identifyBottlenecks(leads),
                nextBestActions: generateNextActions(leads.slice(0, 5)) // Top 5 leads
            },
            // Market Intelligence
            marketIntelligence: {
                hotSegments: getHotSegments(leads),
                priceOptimization: getPriceOptimization(leads),
                demandTrends: getDemandTrends(leads)
            },
            // Revenue Forecasting
            revenueForecast: {
                totalPotentialValue: leads.reduce((sum, l) => sum + l.budget_max, 0),
                predictedRevenue: Math.round(leads.reduce((sum, l) => sum + (l.budget_max * l.predicted_conversion_likelihood), 0)),
                roi: calculateROI(leads, campaign.budget),
                confidenceInterval: "70-120%"
            }
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
      )
      SELECT 
        json_build_object(
          'conversionPredictions', (SELECT json_agg(conversion_predictions) FROM conversion_predictions),
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
// 🎯 REAL-TIME LEAD SCORING
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
                totalValue: realtimeData.rows.reduce((sum, l) => sum + parseInt(l.budget_max), 0)
            }
        });
    }
    catch (err) {
        console.error('Error generating realtime scoring:', err);
        res.status(500).json({ message: 'Error generating realtime scoring' });
    }
}));
// Helper functions (inline to avoid import issues)
function getStageDistribution(leads) {
    const stages = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
    }, {});
    return stages;
}
function calculateAvgConversionTime(leads) {
    return 21; // Simplified
}
function identifyBottlenecks(leads) {
    const stages = getStageDistribution(leads);
    const maxStage = Object.entries(stages).reduce((a, b) => stages[a[0]] > stages[b[0]] ? a : b);
    return [`${maxStage[0]} stage has ${maxStage[1]} leads`];
}
function generateNextActions(leads) {
    return leads.map(lead => ({
        leadId: lead.id,
        leadName: `${lead.first_name} ${lead.last_name}`,
        action: lead.status === 'Hot' ? 'IMMEDIATE_CALL' : 'FOLLOW_UP',
        urgency: lead.predicted_conversion_likelihood > 0.7 ? 'HIGH' : 'MEDIUM',
        reasoning: `${Math.round(lead.predicted_conversion_likelihood * 100)}% conversion probability`
    }));
}
function getHotSegments(leads) {
    const segments = leads.reduce((acc, lead) => {
        acc[lead.buyer_segment] = (acc[lead.buyer_segment] || 0) + lead.predicted_conversion_likelihood;
        return acc;
    }, {});
    return Object.entries(segments)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([segment, score]) => ({ segment, score: Math.round(score * 100) / 100 }));
}
function getPriceOptimization(leads) {
    const avgBudget = leads.reduce((sum, l) => sum + l.budget_max, 0) / leads.length;
    return {
        optimalPricePoint: Math.round(avgBudget),
        priceRange: `$${Math.round(avgBudget * 0.8)} - $${Math.round(avgBudget * 1.2)}`,
        recommendation: 'Price within 20% of optimal point for best conversion'
    };
}
function getDemandTrends(leads) {
    const propertyTypes = leads.reduce((acc, lead) => {
        acc[lead.property_type] = (acc[lead.property_type] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(propertyTypes)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => ({ propertyType: type, demand: count }));
}
function calculateROI(leads, budget) {
    const predictedRevenue = leads.reduce((sum, l) => sum + (l.budget_max * l.predicted_conversion_likelihood), 0);
    return Math.round(((predictedRevenue - budget) / budget) * 100);
}
