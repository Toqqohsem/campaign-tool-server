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
// server/src/routes/analytics.ts
const express_1 = require("express");
const db_1 = require("../db");
const mlModel_1 = require("../utils/mlModel");
exports.analyticsRoutes = (0, express_1.Router)();
// 🚀 CORE AI INSIGHTS - Your Main Differentiator (DEBUG VERSION)
exports.analyticsRoutes.get('/ai-insights/:campaign_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.params;
        console.log('Campaign ID:', campaign_id);
        // Test database connection first
        const testQuery = yield (0, db_1.query)('SELECT COUNT(*) FROM campaigns');
        console.log('Database connection test:', testQuery.rows);
        // Get campaign data step by step
        const campaignData = yield (0, db_1.query)('SELECT * FROM campaigns WHERE id = $1', [campaign_id]);
        console.log('Campaign data:', campaignData.rows);
        if (campaignData.rows.length === 0) {
            const availableCampaigns = yield (0, db_1.query)('SELECT id, name FROM campaigns LIMIT 5');
            return res.json({
                error: 'Campaign not found',
                availableCampaigns: availableCampaigns.rows
            });
        }
        const leadsData = yield (0, db_1.query)('SELECT * FROM leads WHERE campaign_id = $1', [campaign_id]);
        console.log('Leads count:', leadsData.rows.length);
        const personasData = yield (0, db_1.query)('SELECT * FROM personas WHERE campaign_id = $1', [campaign_id]);
        console.log('Personas count:', personasData.rows.length);
        const campaign = campaignData.rows[0];
        const leads = leadsData.rows;
        const personas = personasData.rows;
        // Simple AI insights without complex calculations
        const aiInsights = {
            basicStats: {
                totalLeads: leads.length,
                avgConversionScore: leads.length > 0 ?
                    Math.round((leads.reduce((sum, l) => sum + (l.predicted_conversion_likelihood || 0), 0) / leads.length) * 100) / 100 : 0,
                highValueLeads: leads.filter((l) => (l.predicted_conversion_likelihood || 0) > 0.7).length,
                hotLeads: leads.filter((l) => l.status === 'Hot').length
            },
            predictions: {
                totalPotentialValue: leads.reduce((sum, l) => sum + (l.budget_max || 0), 0),
                predictedRevenue: Math.round(leads.reduce((sum, l) => sum + ((l.budget_max || 0) * (l.predicted_conversion_likelihood || 0)), 0)),
                roi: campaign.budget ? Math.round(((leads.reduce((sum, l) => sum + ((l.budget_max || 0) * (l.predicted_conversion_likelihood || 0)), 0) - campaign.budget) / campaign.budget) * 100) : 0
            },
            mlRecommendations: leads.length > 0 ? (0, mlModel_1.generateMLRecommendations)(leads) : []
        };
        res.json({
            success: true,
            campaign: campaign.name,
            aiInsights,
            generatedAt: new Date().toISOString()
        });
    }
    catch (err) {
        console.error('Detailed error:', err);
        res.status(500).json({
            message: 'Error generating AI insights',
            error: err.message,
            stack: err.stack
        });
    }
}));
// 🔍 SIMPLE TEST ENDPOINT
exports.analyticsRoutes.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield (0, db_1.query)('SELECT id, name FROM campaigns LIMIT 3');
        const leads = yield (0, db_1.query)('SELECT COUNT(*) as count FROM leads');
        res.json({
            message: 'Analytics API is working!',
            availableCampaigns: campaigns.rows,
            totalLeads: leads.rows[0].count
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
