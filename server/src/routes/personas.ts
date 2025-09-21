// server/src/routes/personas.ts

import { Router } from 'express';
import { query } from '../db';

export const personaRoutes = Router();

// Get all personas, or by campaign_id
personaRoutes.get('/', async (req, res) => {
  try {
    const { campaign_id } = req.query;
    let sql = 'SELECT * FROM personas';
    const params: any[] = [];
    if (campaign_id) {
      sql += ' WHERE campaign_id = $1';
      params.push(campaign_id as string);
    }
    sql += ' ORDER BY created_at DESC';
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching personas:', err);
    res.status(500).json({ message: 'Error fetching personas' });
  }
});

// Create persona
personaRoutes.post('/', async (req, res) => {
  try {
    const { campaign_id, name, key_motivations, pain_points } = req.body;
    const newPersonaId = Date.now().toString();
    const { rows } = await query(
      'INSERT INTO personas (id, campaign_id, name, key_motivations, pain_points) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newPersonaId, campaign_id, name, key_motivations, pain_points]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating persona:', err);
    res.status(500).json({ message: 'Error creating persona' });
  }
});

// Update persona
personaRoutes.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, key_motivations, pain_points } = req.body;
    const { rows } = await query(
      'UPDATE personas SET name = $1, key_motivations = $2, pain_points = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [name, key_motivations, pain_points, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Persona not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating persona:', err);
    res.status(500).json({ message: 'Error updating persona' });
  }
});

// Delete persona
personaRoutes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM personas WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting persona:', err);
    res.status(500).json({ message: 'Error deleting persona' });
  }
});