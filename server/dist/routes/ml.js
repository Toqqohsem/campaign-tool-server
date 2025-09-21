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
const db_1 = require("../db");
exports.mlRoutes = (0, express_1.Router)();
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
        let leads = [];
        if (campaign_id) {
            const { rows } = yield (0, db_1.query)('SELECT * FROM leads WHERE campaign_id = $1', [campaign_id]);
            leads = rows;
        }
        else {
            const { rows } = yield (0, db_1.query)('SELECT * FROM leads');
            leads = rows;
        }
        const recommendations = (0, mlModel_1.generateMLRecommendations)(leads);
        res.json({ recommendations });
    }
    catch (err) {
        console.error('Error generating ML recommendations:', err);
        res.status(500).json({ message: 'Error generating ML recommendations' });
    }
}));
