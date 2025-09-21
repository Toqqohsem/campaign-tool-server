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
const express_1 = require("express");
const db_1 = require("../db");
exports.creativeAssetRoutes = (0, express_1.Router)();
// Get all creative assets, or by campaign_id
exports.creativeAssetRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.query;
        let sql = 'SELECT * FROM creative_assets';
        const params = [];
        if (campaign_id) {
            sql += ' WHERE campaign_id = $1';
            params.push(campaign_id);
        }
        sql += ' ORDER BY created_at DESC';
        const { rows } = yield (0, db_1.query)(sql, params);
        res.json(rows);
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
        const newAssetId = Date.now().toString();
        const { rows } = yield (0, db_1.query)('INSERT INTO creative_assets (id, campaign_id, persona_id, type, filename, url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [newAssetId, campaign_id, persona_id, type, filename, url]);
        res.status(201).json(rows[0]);
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
        yield (0, db_1.query)('DELETE FROM creative_assets WHERE id = $1', [id]);
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting creative asset:', err);
        res.status(500).json({ message: 'Error deleting creative asset' });
    }
}));
