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
// 🚀 DEMO ENDPOINT WITH MOCK DATA (for AWS event)
analyticsRoutes.get('/demo-insights/:campaign_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
