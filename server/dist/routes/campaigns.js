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
exports.campaignRoutes = void 0;
const express_1 = require("express");
exports.campaignRoutes = (0, express_1.Router)();
// Mock data from your migration.sql
const mockCampaigns = [
    {
        id: '1',
        name: 'Luxury Condos Downtown',
        project: 'SkyView Towers',
        objective: 'Lead Generation',
        budget: 50000,
        start_date: '2024-01-15',
        end_date: '2024-04-15',
        status: 'active',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-15T14:30:00Z'
    },
    {
        id: '2',
        name: 'Family Homes Suburbia',
        project: 'Green Valley Estates',
        objective: 'Brand Awareness',
        budget: 35000,
        start_date: '2024-02-01',
        end_date: '2024-05-01',
        status: 'active',
        created_at: '2024-01-25T09:15:00Z',
        updated_at: '2024-02-01T11:20:00Z'
    },
    {
        id: '3',
        name: 'Investment Properties',
        project: 'Metro Investment Hub',
        objective: 'Conversion',
        budget: 75000,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'paused',
        created_at: '2023-12-20T16:45:00Z',
        updated_at: '2024-01-20T13:10:00Z'
    }
];
// Get all campaigns
exports.campaignRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(mockCampaigns);
    }
    catch (err) {
        console.error('Error fetching campaigns:', err);
        res.status(500).json({ message: 'Error fetching campaigns' });
    }
}));
// Get campaign by ID
exports.campaignRoutes.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const campaign = mockCampaigns.find(c => c.id === id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(campaign);
    }
    catch (err) {
        console.error('Error fetching campaign:', err);
        res.status(500).json({ message: 'Error fetching campaign' });
    }
}));
// Create campaign
exports.campaignRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, project, objective, budget, start_date, end_date, status } = req.body;
        const newCampaign = {
            id: String(mockCampaigns.length + 1),
            name,
            project,
            objective,
            budget,
            start_date,
            end_date,
            status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        mockCampaigns.push(newCampaign);
        res.status(201).json(newCampaign);
    }
    catch (err) {
        console.error('Error creating campaign:', err);
        res.status(500).json({ message: 'Error creating campaign' });
    }
}));
// Update campaign
exports.campaignRoutes.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, project, objective, budget, start_date, end_date, status } = req.body;
        const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
        if (campaignIndex === -1) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        mockCampaigns[campaignIndex] = Object.assign(Object.assign({}, mockCampaigns[campaignIndex]), { name,
            project,
            objective,
            budget,
            start_date,
            end_date,
            status, updated_at: new Date().toISOString() });
        res.json(mockCampaigns[campaignIndex]);
    }
    catch (err) {
        console.error('Error updating campaign:', err);
        res.status(500).json({ message: 'Error updating campaign' });
    }
}));
// Delete campaign
exports.campaignRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
        if (campaignIndex === -1) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        mockCampaigns.splice(campaignIndex, 1);
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting campaign:', err);
        res.status(500).json({ message: 'Error deleting campaign' });
    }
}));
