import { Router } from 'express';
import { query } from '../db';

export const adCopyRoutes = Router();

// Get all ad copy, or by campaign_id
adCopyRoutes.get('/', async (req, res) => {
  try {
    const { campaign_id } = req.query;
    let sql = 'SELECT * FROM ad_copy';
    const params: any[] = [];
    if (campaign_id) {
      sql += ' WHERE campaign_id = $1';
      params.push(campaign_id);
    }
    sql += ' ORDER BY created_at DESC';
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching ad copy:', err);
    res.status(500).json({ message: 'Error fetching ad copy' });
  }
});

// Create ad copy
adCopyRoutes.post('/', async (req, res) => {
  try {
    const { campaign_id, persona_id, headline, description } = req.body;
    const newAdCopyId = Date.now().toString();
    const { rows } = await query(
      'INSERT INTO ad_copy (id, campaign_id, persona_id, headline, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newAdCopyId, campaign_id, persona_id, headline, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating ad copy:', err);
    res.status(500).json({ message: 'Error creating ad copy' });
  }
});

// Update ad copy
adCopyRoutes.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { headline, description } = req.body;
    const { rows } = await query(
      'UPDATE ad_copy SET headline = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [headline, description, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Ad copy not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating ad copy:', err);
    res.status(500).json({ message: 'Error updating ad copy' });
  }
});

// Delete ad copy
adCopyRoutes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM ad_copy WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting ad copy:', err);
    res.status(500).json({ message: 'Error deleting ad copy' });
  }
});
