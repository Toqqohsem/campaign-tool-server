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
exports.adCopyRoutes = void 0;
const express_1 = require("express");
const db_1 = require("../db");
exports.adCopyRoutes = (0, express_1.Router)();
// Get all ad copy, or by campaign_id
exports.adCopyRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.query;
        let sql = 'SELECT * FROM ad_copy';
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
        console.error('Error fetching ad copy:', err);
        res.status(500).json({ message: 'Error fetching ad copy' });
    }
}));
// Create ad copy
exports.adCopyRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id, persona_id, headline, description } = req.body;
        const newAdCopyId = Date.now().toString();
        const { rows } = yield (0, db_1.query)('INSERT INTO ad_copy (id, campaign_id, persona_id, headline, description) VALUES ($1, $2, $3, $4, $5) RETURNING *', [newAdCopyId, campaign_id, persona_id, headline, description]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error('Error creating ad copy:', err);
        res.status(500).json({ message: 'Error creating ad copy' });
    }
}));
// Update ad copy
exports.adCopyRoutes.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { headline, description } = req.body;
        const { rows } = yield (0, db_1.query)('UPDATE ad_copy SET headline = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *', [headline, description, id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Ad copy not found' });
        }
        res.json(rows[0]);
    }
    catch (err) {
        console.error('Error updating ad copy:', err);
        res.status(500).json({ message: 'Error updating ad copy' });
    }
}));
// Delete ad copy
exports.adCopyRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, db_1.query)('DELETE FROM ad_copy WHERE id = $1', [id]);
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting ad copy:', err);
        res.status(500).json({ message: 'Error deleting ad copy' });
    }
}));
