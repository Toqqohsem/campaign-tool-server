// ============================================
// Replace adcopy.ts with this content:

import { Router } from 'express';

export const adCopyRoutes = Router();

const mockAdCopy = [
  {
    id: '1',
    campaign_id: '1',
    persona_id: '1',
    headline: 'Live Where You Work - Luxury Downtown Living',
    description: 'Step out your door to world-class dining, entertainment, and your office. Modern amenities meet urban convenience.',
    created_at: '2024-01-12T11:45:00Z',
    updated_at: '2024-01-12T11:45:00Z'
  },
  {
    id: '2',
    campaign_id: '1',
    persona_id: '2',
    headline: 'Embrace the Freedom of Downtown Living',
    description: 'Trade yard work for yoga classes. Maintenance-free luxury with concierge services and resort-style amenities.',
    created_at: '2024-01-12T11:50:00Z',
    updated_at: '2024-01-12T11:50:00Z'
  },
  {
    id: '3',
    campaign_id: '2',
    persona_id: '3',
    headline: 'Your Family\'s Perfect Home Awaits',
    description: 'Safe neighborhoods, excellent schools, and space to grow. Everything your family needs in one beautiful community.',
    created_at: '2024-01-26T15:10:00Z',
    updated_at: '2024-01-26T15:10:00Z'
  }
];

// Get all ad copy, or by campaign_id
adCopyRoutes.get('/', async (req, res) => {
  try {
    const { campaign_id, persona_id } = req.query;
    let adCopy = mockAdCopy;
    if (campaign_id) {
      adCopy = adCopy.filter(a => a.campaign_id === campaign_id as string);
    }
    if (persona_id) {
      adCopy = adCopy.filter(a => a.persona_id === persona_id as string);
    }
    res.json(adCopy);
  } catch (err) {
    console.error('Error fetching ad copy:', err);
    res.status(500).json({ message: 'Error fetching ad copy' });
  }
});

// Create ad copy
adCopyRoutes.post('/', async (req, res) => {
  try {
    const { campaign_id, persona_id, headline, description } = req.body;
    const newAdCopy = {
      id: String(mockAdCopy.length + 1),
      campaign_id,
      persona_id,
      headline,
      description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockAdCopy.push(newAdCopy);
    res.status(201).json(newAdCopy);
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
    const adCopyIndex = mockAdCopy.findIndex(a => a.id === id);
    if (adCopyIndex === -1) {
      return res.status(404).json({ message: 'Ad copy not found' });
    }
    
    mockAdCopy[adCopyIndex] = {
      ...mockAdCopy[adCopyIndex],
      headline,
      description,
      updated_at: new Date().toISOString()
    };
    
    res.json(mockAdCopy[adCopyIndex]);
  } catch (err) {
    console.error('Error updating ad copy:', err);
    res.status(500).json({ message: 'Error updating ad copy' });
  }
});

// Delete ad copy
adCopyRoutes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const adCopyIndex = mockAdCopy.findIndex(a => a.id === id);
    if (adCopyIndex === -1) {
      return res.status(404).json({ message: 'Ad copy not found' });
    }
    
    mockAdCopy.splice(adCopyIndex, 1);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting ad copy:', err);
    res.status(500).json({ message: 'Error deleting ad copy' });
  }
});