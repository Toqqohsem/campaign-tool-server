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
exports.personaRoutes = void 0;
const express_1 = require("express");
exports.personaRoutes = (0, express_1.Router)();
// Mock data from your migration.sql
const mockPersonas = [
    {
        id: '1',
        campaign_id: '1',
        name: 'Young Professional',
        key_motivations: 'Urban lifestyle, convenience, status symbol, walkability to work',
        pain_points: 'High prices, limited parking, noise concerns, HOA fees',
        created_at: '2024-01-10T10:30:00Z',
        updated_at: '2024-01-10T10:30:00Z'
    },
    {
        id: '2',
        campaign_id: '1',
        name: 'Empty Nester Couple',
        key_motivations: 'Downsizing, low maintenance, amenities, security',
        pain_points: 'Leaving family home, storage space, community connection',
        created_at: '2024-01-10T10:35:00Z',
        updated_at: '2024-01-10T10:35:00Z'
    },
    {
        id: '3',
        campaign_id: '2',
        name: 'Growing Family',
        key_motivations: 'Space for children, good schools, safe neighborhood, outdoor space',
        pain_points: 'Budget constraints, long commutes, finding right school district',
        created_at: '2024-01-25T09:30:00Z',
        updated_at: '2024-01-25T09:30:00Z'
    },
    {
        id: '4',
        campaign_id: '2',
        name: 'First-time Homebuyer',
        key_motivations: 'Building equity, stability, pride of ownership, tax benefits',
        pain_points: 'Down payment, credit requirements, market complexity, inspection fears',
        created_at: '2024-01-25T09:35:00Z',
        updated_at: '2024-01-25T09:35:00Z'
    }
];
// Get all personas, or by campaign_id
exports.personaRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { campaign_id } = req.query;
        let personas = mockPersonas;
        if (campaign_id) {
            personas = personas.filter(p => p.campaign_id === campaign_id);
        }
        res.json(personas);
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
        const newPersona = {
            id: String(mockPersonas.length + 1),
            campaign_id,
            name,
            key_motivations,
            pain_points,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        mockPersonas.push(newPersona);
        res.status(201).json(newPersona);
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
        const personaIndex = mockPersonas.findIndex(p => p.id === id);
        if (personaIndex === -1) {
            return res.status(404).json({ message: 'Persona not found' });
        }
        mockPersonas[personaIndex] = Object.assign(Object.assign({}, mockPersonas[personaIndex]), { name,
            key_motivations,
            pain_points, updated_at: new Date().toISOString() });
        res.json(mockPersonas[personaIndex]);
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
        const personaIndex = mockPersonas.findIndex(p => p.id === id);
        if (personaIndex === -1) {
            return res.status(404).json({ message: 'Persona not found' });
        }
        mockPersonas.splice(personaIndex, 1);
        res.status(204).send();
    }
    catch (err) {
        console.error('Error deleting persona:', err);
        res.status(500).json({ message: 'Error deleting persona' });
    }
}));
