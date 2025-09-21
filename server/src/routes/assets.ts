import { Router } from 'express';
import { query } from '../db';

export const creativeAssetRoutes = Router();

// Get all creative assets, or by campaign_id
creativeAssetRoutes.get('/', async (req, res) => {
  try {
    const { campaign_id } = req.query;
    let sql = 'SELECT * FROM creative_assets';
    const params: any[] = [];
    if (campaign_id) {
      sql += ' WHERE campaign_id = $1';
      params.push(campaign_id);
    }
    sql += ' ORDER BY created_at DESC';
    const { rows } = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching creative assets:', err);
    res.status(500).json({ message: 'Error fetching creative assets' });
  }
});

// Create creative asset
creativeAssetRoutes.post('/', async (req, res) => {
  try {
    const { campaign_id, persona_id, type, filename, url } = req.body;
    const newAssetId = Date.now().toString();
    const { rows } = await query(
      'INSERT INTO creative_assets (id, campaign_id, persona_id, type, filename, url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [newAssetId, campaign_id, persona_id, type, filename, url]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating creative asset:', err);
    res.status(500).json({ message: 'Error creating creative asset' });
  }
});

// Delete creative asset
creativeAssetRoutes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM creative_assets WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting creative asset:', err);
    res.status(500).json({ message: 'Error deleting creative asset' });
  }
});
