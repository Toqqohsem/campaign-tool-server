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
exports.creativeAssetRoutes = void 0;
// Replace assets.ts with this content:
const express_1 = require("express");
exports.creativeAssetRoutes = (0, express_1.Router)();
const mockCreativeAssets = [
    {
        id: '1',
        campaign_id: '1',
        persona_id: '1',
        type: 'image',
        filename: 'downtown-condo-hero.jpg',
        url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        created_at: '2024-01-12T09:15:00Z'
    },
    {
        id: '2',
        campaign_id: '1',
        persona_id: '1',
        type: 'video',
        filename: 'virtual-tour.mp4',
        url: 'https://example.com/virtual-tour.mp4',
        created_at: '2024-01-12T10:30:00Z'
    },
    {
        id: '3',
        campaign_id: '2',
        persona_id: '3',
        type: 'image',
        filename: 'family-home-exterior.jpg',
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        created_at: '2024-01-26T14:20:00Z'
    }
];
// Get all creative assets, or by campaign_id
exports.creativeAssetRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id, persona_id } = req.query;
        let assets = mockCreativeAssets;
        if (campaign_id) {
            assets = assets.filter(a => a.campaign_id === campaign_id);
        }
        if (persona_id) {
            assets = assets.filter(a => a.persona_id === persona_id);
        }
        res.json(assets);
    }
    catch (err) {
        console.error('Error fetching creative assets:', err);
        res.status(500).json({ message: 'Error fetching creative assets' });
    }
}));
// Create creative asset
exports.creativeAssetRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id, persona_id, type, filename, url } = req.body;
        const newAsset = {
            id: String(mockCreativeAssets.length + 1),
            campaign_id,
            persona_id,
            type,
            filename,
            url,
            created_at: new Date().toISOString()
        };
        mockCreativeAssets.push(newAsset);
        res.status(201).json(newAsset);
    }
    catch (err) {
        console.error('Error creating creative asset:', err);
        res.status(500).json({ message: 'Error creating creative asset' });
    }
}));
// Delete creative asset
exports.creativeAssetRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const assetIndex = mockCreativeAssets.findIndex(a => a.id === id);
        if (assetIndex === -1) {
            return res.status(404).json({ message: 'Creative asset not found' });
        }
        mockCreativeAssets.splice(assetIndex, 1);
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting creative asset:', err);
        res.status(500).json({ message: 'Error deleting creative asset' });
    }
}));
