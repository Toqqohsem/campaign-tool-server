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
exports.leadRoutes = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const mlModel_1 = require("../utils/mlModel"); // Import ML model
exports.leadRoutes = (0, express_1.Router)();
// Get all leads, or by campaign_id
exports.leadRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.query;
        let sql = 'SELECT * FROM leads';
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
        console.error('Error fetching leads:', err);
        res.status(500).json({ message: 'Error fetching leads' });
    }
}));
// Create lead (with ML scoring)
exports.leadRoutes.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leadData = req.body;
        const newLeadId = Date.now().toString();
        // Calculate ML score and segment
        const { score, segment } = (0, mlModel_1.calculateLeadScore)(leadData);
        const { rows } = yield (0, db_1.query)(`INSERT INTO leads (id, campaign_id, persona_id, first_name, last_name, email, phone, status, rejection_reason, age_range, income_bracket, family_size, occupation, education_level, bedrooms, bathrooms, location_area, budget_min, budget_max, property_type, must_have_features, interaction_history, predicted_conversion_likelihood, buyer_segment) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *`, [
            newLeadId, leadData.campaign_id, leadData.persona_id, leadData.first_name, leadData.last_name, leadData.email, leadData.phone, leadData.status, leadData.rejection_reason,
            leadData.age_range, leadData.income_bracket, leadData.family_size, leadData.occupation, leadData.education_level, leadData.bedrooms, leadData.bathrooms,
            leadData.location_area, leadData.budget_min, leadData.budget_max, leadData.property_type, leadData.must_have_features, leadData.interaction_history,
            score, segment
        ]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        console.error('Error creating lead:', err);
        res.status(500).json({ message: 'Error creating lead' });
    }
}));
// Update lead (with ML scoring)
exports.leadRoutes.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Fetch existing lead to merge updates
        const existingLeadRes = yield (0, db_1.query)('SELECT * FROM leads WHERE id = $1', [id]);
        if (existingLeadRes.rows.length === 0) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        const existingLead = existingLeadRes.rows[0];
        const mergedLead = Object.assign(Object.assign({}, existingLead), updates);
        // Recalculate ML score and segment
        const { score, segment } = (0, mlModel_1.calculateLeadScore)(mergedLead);
        const { rows } = yield (0, db_1.query)(`UPDATE leads SET 
        campaign_id = $1, persona_id = $2, first_name = $3, last_name = $4, email = $5, phone = $6, status = $7, rejection_reason = $8, age_range = $9, income_bracket = $10, family_size = $11, occupation = $12, education_level = $13, bedrooms = $14, bathrooms = $15, location_area = $16, budget_min = $17, budget_max = $18, property_type = $19, must_have_features = $20, interaction_history = $21, predicted_conversion_likelihood = $22, buyer_segment = $23, updated_at = NOW() 
       WHERE id = $24 RETURNING *`, [
            mergedLead.campaign_id, mergedLead.persona_id, mergedLead.first_name, mergedLead.last_name, mergedLead.email, mergedLead.phone, mergedLead.status, mergedLead.rejection_reason,
            mergedLead.age_range, mergedLead.income_bracket, mergedLead.family_size, mergedLead.occupation, mergedLead.education_level, mergedLead.bedrooms, mergedLead.bathrooms,
            mergedLead.location_area, mergedLead.budget_min, mergedLead.budget_max, mergedLead.property_type, mergedLead.must_have_features, mergedLead.interaction_history,
            score, segment, id
        ]);
        res.json(rows[0]);
    }
    catch (err) {
        console.error('Error updating lead:', err);
        res.status(500).json({ message: 'Error updating lead' });
    }
}));
// Delete lead
exports.leadRoutes.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield (0, db_1.query)('DELETE FROM leads WHERE id = $1', [id]);
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting lead:', err);
        res.status(500).json({ message: 'Error deleting lead' });
    }
}));
// Bulk import leads
exports.leadRoutes.post('/bulk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const leadsData = req.body.leads;
        const insertedLeads = [];
        for (const leadData of leadsData) {
            const newLeadId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            const { score, segment } = (0, mlModel_1.calculateLeadScore)(leadData);
            const { rows } = yield (0, db_1.query)(`INSERT INTO leads (id, campaign_id, persona_id, first_name, last_name, email, phone, status, rejection_reason, age_range, income_bracket, family_size, occupation, education_level, bedrooms, bathrooms, location_area, budget_min, budget_max, property_type, must_have_features, interaction_history, predicted_conversion_likelihood, buyer_segment) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *`, [
                newLeadId, leadData.campaign_id, leadData.persona_id, leadData.first_name, leadData.last_name, leadData.email, leadData.phone, leadData.status, leadData.rejection_reason,
                leadData.age_range, leadData.income_bracket, leadData.family_size, leadData.occupation, leadData.education_level, leadData.bedrooms, leadData.bathrooms,
                leadData.location_area, leadData.budget_min, leadData.budget_max, leadData.property_type, leadData.must_have_features, leadData.interaction_history,
                score, segment
            ]);
            insertedLeads.push(rows[0]);
        }
        res.status(201).json(insertedLeads);
    }
    catch (err) {
        console.error('Error bulk importing leads:', err);
        res.status(500).json({ message: 'Error bulk importing leads' });
    }
}));
