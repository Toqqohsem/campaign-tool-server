"use strict";
// server/src/routes/personas.ts
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
exports.personaRoutes = void 0;
const express_1 = require("express");
const db_1 = require("../db");
exports.personaRoutes = (0, express_1.Router)();
// Get all personas, or by campaign_id
exports.personaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.query;
        let sql = 'SELECT * FROM personas';
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
        console.error('Error fetching personas:', err);
        res.status(500).json({ message: 'Error fetching personas' });
    }
}));
// Create persona
exports.personaRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id, name, key_motivations, pain_points } = req.body;
        const newPersonaId = Date.now().toString();
        const { rows } = yield (0, db_1.query)('INSERT INTO personas (id, campaign_id, name, key_motivations, pain_points) VALUES ($1, $2, $3, $4, $5) RETURNING *', [newPersonaId, campaign_id, name, key_motivations, pain_points]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error('Error creating persona:', err);
        res.status(500).json({ message: 'Error creating persona' });
    }
}));
// Update persona
exports.personaRoutes.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, key_motivations, pain_points } = req.body;
        const { rows } = yield (0, db_1.query)('UPDATE personas SET name = $1, key_motivations = $2, pain_points = $3, updated_at = NOW() WHERE id = $4 RETURNING *', [name, key_motivations, pain_points, id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Persona not found' });
        }
        res.json(rows[0]);
    }
    catch (err) {
        console.error('Error updating persona:', err);
        res.status(500).json({ message: 'Error updating persona' });
    }
}));
// Delete persona
exports.personaRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, db_1.query)('DELETE FROM personas WHERE id = $1', [id]);
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting persona:', err);
        res.status(500).json({ message: 'Error deleting persona' });
    }
}));
