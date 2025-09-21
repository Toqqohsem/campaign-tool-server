// client/src/hooks/useCampaigns.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Campaign, Persona, Lead, CreativeAsset, AdCopy } from '../types'; // We will create this types file

// ... (interfaces for context will go here)

const CampaignsContext = createContext<any>(null);

export const CampaignsProvider = ({ children }: { children: React.ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [creativeAssets, setCreativeAssets] = useState<CreativeAsset[]>([]);
  const [adCopy, setAdCopy] = useState<AdCopy[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [campaignsRes, personasRes, leadsRes, assetsRes, adCopyRes] = await Promise.all([
        api.get('/campaigns'),
        api.get('/personas'),
        api.get('/leads'),
        api.get('/creative-assets'),
        api.get('/ad-copy'),
      ]);
      setCampaigns(campaignsRes.data);
      setPersonas(personasRes.data);
      setLeads(leadsRes.data);
      setCreativeAssets(assetsRes.data);
      setAdCopy(adCopyRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError('Failed to load data from the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CRUD functions (createLead, updateLead, etc.) would go here
  // For brevity, we'll just add a few examples
  const createCampaign = async (data: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post('/campaigns', data);
    setCampaigns(prev => [response.data, ...prev]);
  };

  const createLead = async (data: any) => {
    const response = await api.post('/leads', data);
    setLeads(prev => [response.data, ...prev]);
  };

  const value = { campaigns, personas, leads, creativeAssets, adCopy, selectedCampaignId, setSelectedCampaignId, loading, error, createCampaign, createLead /* ... other functions */ };

  return <CampaignsContext.Provider value={value}>{children}</CampaignsContext.Provider>;
};

export const useCampaigns = () => useContext(CampaignsContext);