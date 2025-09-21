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
const db_1 = require("../db");
exports.campaignRoutes = (0, express_1.Router)();
// Get all campaigns
exports.campaignRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield (0, db_1.query)('SELECT * FROM campaigns ORDER BY created_at DESC');
        res.json(rows);
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
        const { rows } = yield (0, db_1.query)('SELECT * FROM campaigns WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(rows[0]);
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
        const newCampaignId = Date.now().toString();
        const { rows } = yield (0, db_1.query)('INSERT INTO campaigns (id, name, project, objective, budget, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [newCampaignId, name, project, objective, budget, start_date, end_date, status]);
        res.status(201).json(rows[0]);
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
        const { rows } = yield (0, db_1.query)('UPDATE campaigns SET name = $1, project = $2, objective = $3, budget = $4, start_date = $5, end_date = $6, status = $7, updated_at = NOW() WHERE id = $8 RETURNING *', [name, project, objective, budget, start_date, end_date, status, id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(rows[0]);
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
        yield (0, db_1.query)('DELETE FROM campaigns WHERE id = $1', [id]);
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting campaign:', err);
        res.status(500).json({ message: 'Error deleting campaign' });
    }
}));
