// Replace assets.ts with this content:
import { Router } from 'express';

export const creativeAssetRoutes = Router();

const mockCreativeAssets = [
  {
    id: '1',
    campaign_id: '1',
    persona_id: '1',
    type: 'image',
    filename: 'downtown-condo-hero.jpg',
    url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    created_at: '2024-01-12T09:15:00Z'
  },
  {
    id: '2',
    campaign_id: '1',
    persona_id: '1',
    type: 'video',
    filename: 'virtual-tour.mp4',
    url: 'https://example.com/virtual-tour.mp4',
    created_at: '2024-01-12T10:30:00Z'
  },
  {
    id: '3',
    campaign_id: '2',
    persona_id: '3',
    type: 'image',
    filename: 'family-home-exterior.jpg',
    url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    created_at: '2024-01-26T14:20:00Z'
  }
];

// Get all creative assets, or by campaign_id
creativeAssetRoutes.get('/', async (req, res) => {
  try {
    const { campaign_id, persona_id } = req.query;
    let assets = mockCreativeAssets;
    if (campaign_id) {
      assets = assets.filter(a => a.campaign_id === campaign_id as string);
    }
    if (persona_id) {
      assets = assets.filter(a => a.persona_id === persona_id as string);
    }
    res.json(assets);
  } catch (err) {
    console.error('Error fetching creative assets:', err);
    res.status(500).json({ message: 'Error fetching creative assets' });
  }
});

// Create creative asset
creativeAssetRoutes.post('/', async (req, res) => {
  try {
    const { campaign_id, persona_id, type, filename, url } = req.body;
    const newAsset = {
      id: String(mockCreativeAssets.length + 1),
      campaign_id,
      persona_id,
      type,
      filename,
      url,
      created_at: new Date().toISOString()
    };
    mockCreativeAssets.push(newAsset);
    res.status(201).json(newAsset);
  } catch (err) {
    console.error('Error creating creative asset:', err);
    res.status(500).json({ message: 'Error creating creative asset' });
  }
});

// Delete creative asset
creativeAssetRoutes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const assetIndex = mockCreativeAssets.findIndex(a => a.id === id);
    if (assetIndex === -1) {
      return res.status(404).json({ message: 'Creative asset not found' });
    }
    
    mockCreativeAssets.splice(assetIndex, 1);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting creative asset:', err);
    res.status(500).json({ message: 'Error deleting creative asset' });
  }
});

