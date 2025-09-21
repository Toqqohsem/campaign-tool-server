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
exports.mlRoutes = void 0;
const express_1 = require("express");
const mlModel_1 = require("../utils/mlModel");
exports.mlRoutes = (0, express_1.Router)();
// Mock leads data - same as in leads.ts
const mockLeads = [
    {
        id: '1',
        campaign_id: '1',
        persona_id: '1',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@email.com',
        phone: '555-0123',
        status: 'Hot',
        rejection_reason: null,
        age_range: '25-34',
        income_bracket: '$75,000-$100,000',
        family_size: 1,
        occupation: 'Software Engineer',
        education_level: 'Bachelor\'s Degree',
        bedrooms: 2,
        bathrooms: 2,
        location_area: 'Downtown',
        budget_min: 450000,
        budget_max: 600000,
        property_type: 'Condo',
        must_have_features: 'Parking, Balcony, Modern Kitchen',
        interaction_history: 'Viewed property online, attended virtual tour, requested showing',
        predicted_conversion_likelihood: 0.85,
        buyer_segment: 'First-time Buyer',
        created_at: '2024-01-20T14:15:00Z',
        updated_at: '2024-01-22T16:30:00Z'
    },
    {
        id: '2',
        campaign_id: '1',
        persona_id: '2',
        first_name: 'Michael',
        last_name: 'Chen',
        email: 'michael.chen@email.com',
        phone: '555-0124',
        status: 'Converted',
        rejection_reason: null,
        age_range: '55-64',
        income_bracket: '$100,000+',
        family_size: 2,
        occupation: 'Executive',
        education_level: 'Master\'s Degree',
        bedrooms: 2,
        bathrooms: 2,
        location_area: 'Downtown',
        budget_min: 500000,
        budget_max: 750000,
        property_type: 'Condo',
        must_have_features: 'Security, Amenities, Low Maintenance',
        interaction_history: 'Multiple property visits, contract signed, closing scheduled',
        predicted_conversion_likelihood: 0.95,
        buyer_segment: 'Downsizer',
        created_at: '2024-01-18T10:20:00Z',
        updated_at: '2024-01-25T09:45:00Z'
    },
    {
        id: '3',
        campaign_id: '2',
        persona_id: '3',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '555-0125',
        status: 'Site Visit',
        rejection_reason: null,
        age_range: '35-44',
        income_bracket: '$75,000-$100,000',
        family_size: 4,
        occupation: 'Teacher',
        education_level: 'Master\'s Degree',
        bedrooms: 4,
        bathrooms: 3,
        location_area: 'Green Valley',
        budget_min: 350000,
        budget_max: 450000,
        property_type: 'Single Family',
        must_have_features: 'Large Yard, Good Schools, Safe Neighborhood',
        interaction_history: 'Initial inquiry, scheduled showing, visited model home',
        predicted_conversion_likelihood: 0.72,
        buyer_segment: 'Upgrader',
        created_at: '2024-02-02T11:30:00Z',
        updated_at: '2024-02-05T15:15:00Z'
    },
    {
        id: '4',
        campaign_id: '2',
        persona_id: '4',
        first_name: 'David',
        last_name: 'Thompson',
        email: 'david.thompson@email.com',
        phone: '555-0126',
        status: 'Rejected',
        rejection_reason: 'Price',
        age_range: '25-34',
        income_bracket: '$50,000-$75,000',
        family_size: 2,
        occupation: 'Nurse',
        education_level: 'Bachelor\'s Degree',
        bedrooms: 3,
        bathrooms: 2,
        location_area: 'Green Valley',
        budget_min: 250000,
        budget_max: 350000,
        property_type: 'Single Family',
        must_have_features: 'Affordable, Move-in Ready',
        interaction_history: 'Inquired about pricing, found homes outside budget range',
        predicted_conversion_likelihood: 0.25,
        buyer_segment: 'Budget Conscious',
        created_at: '2024-02-01T13:45:00Z',
        updated_at: '2024-02-03T10:20:00Z'
    },
    {
        id: '5',
        campaign_id: '3',
        persona_id: null,
        first_name: 'Jennifer',
        last_name: 'Williams',
        email: 'jennifer.williams@email.com',
        phone: '555-0127',
        status: 'Hot',
        rejection_reason: null,
        age_range: '45-54',
        income_bracket: '$100,000+',
        family_size: 1,
        occupation: 'Real Estate Investor',
        education_level: 'MBA',
        bedrooms: 0,
        bathrooms: 0,
        location_area: 'Metro Area',
        budget_min: 200000,
        budget_max: 1000000,
        property_type: 'Investment',
        must_have_features: 'Cash Flow Positive, Appreciation Potential',
        interaction_history: 'Requested investment analysis, reviewed multiple properties',
        predicted_conversion_likelihood: 0.88,
        buyer_segment: 'Investor',
        created_at: '2024-01-15T16:20:00Z',
        updated_at: '2024-01-18T14:10:00Z'
    }
];
exports.mlRoutes.post('/score-lead', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leadData = req.body;
        const { score, segment } = (0, mlModel_1.calculateLeadScore)(leadData);
        res.json({ score, segment });
    }
    catch (err) {
        console.error('Error scoring lead:', err);
        res.status(500).json({ message: 'Error scoring lead' });
    }
}));
exports.mlRoutes.get('/recommendations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.query;
        let leads = mockLeads;
        if (campaign_id) {
            leads = leads.filter(lead => lead.campaign_id === campaign_id);
        }
        const recommendations = (0, mlModel_1.generateMLRecommendations)(leads);
        res.json({ recommendations });
    }
    catch (err) {
        console.error('Error generating ML recommendations:', err);
        res.status(500).json({ message: 'Error generating ML recommendations' });
    }
}));
