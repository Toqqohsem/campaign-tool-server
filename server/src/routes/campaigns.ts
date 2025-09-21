import { Router } from 'express';
import { query } from '../db';

export const campaignRoutes = Router();

// Get all campaigns
campaignRoutes.get('/', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM campaigns ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
});

// Get campaign by ID
campaignRoutes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query('SELECT * FROM campaigns WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching campaign:', err);
    res.status(500).json({ message: 'Error fetching campaign' });
  }
});

// Create campaign
campaignRoutes.post('/', async (req, res) => {
  try {
    const { name, project, objective, budget, start_date, end_date, status } = req.body;
    const newCampaignId = Date.now().toString();
    const { rows } = await query(
      'INSERT INTO campaigns (id, name, project, objective, budget, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [newCampaignId, name, project, objective, budget, start_date, end_date, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating campaign:', err);
    res.status(500).json({ message: 'Error creating campaign' });
  }
});

// Update campaign
campaignRoutes.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, project, objective, budget, start_date, end_date, status } = req.body;
    const { rows } = await query(
      'UPDATE campaigns SET name = $1, project = $2, objective = $3, budget = $4, start_date = $5, end_date = $6, status = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [name, project, objective, budget, start_date, end_date, status, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating campaign:', err);
    res.status(500).json({ message: 'Error updating campaign' });
  }
});

// Delete campaign
campaignRoutes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM campaigns WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting campaign:', err);
    res.status(500).json({ message: 'Error deleting campaign' });
  }
});
