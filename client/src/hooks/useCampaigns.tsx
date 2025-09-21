// client/src/hooks/useCampaigns.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Campaign, Persona, Lead, CreativeAsset, AdCopy } from '../types';

interface CampaignStats { total_campaigns: number; total_personas: number; total_leads: number; total_conversions: number; conversion_rate: number; avg_conversion_score: number; }
interface CampaignsContextType {
  campaigns: Campaign[];
  personas: Persona[];
  leads: Lead[];
  creativeAssets: CreativeAsset[];
  adCopy: AdCopy[];
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string | null) => void;
  loading: boolean;
  error: string | null;
  createCampaign: (data: any) => Promise<void>;
  updateCampaign: (id: string, data: any) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  createPersona: (data: any) => Promise<void>;
  updatePersona: (id: string, data: any) => Promise<void>;
  deletePersona: (id: string) => Promise<void>;
  createLead: (data: any) => Promise<void>;
  updateLead: (id: string, data: any) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  bulkImportLeads: (leads: any[]) => Promise<void>;
  createCreativeAsset: (data: any) => Promise<void>;
  deleteCreativeAsset: (id: string) => Promise<void>;
  createAdCopy: (data: any) => Promise<void>;
  updateAdCopy: (id: string, data: any) => Promise<void>;
  deleteAdCopy: (id: string) => Promise<void>;
  getCampaignStats: () => CampaignStats;
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined);

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
        api.get('/campaigns'), api.get('/personas'), api.get('/leads'),
        api.get('/creative-assets'), api.get('/ad-copy'),
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

  useEffect(() => { fetchData(); }, [fetchData]);

  // Placeholder functions for all actions
  const createItem = async (endpoint: string, data: any, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    const response = await api.post(endpoint, data);
    setter(prev => [response.data, ...prev]);
  };
  const updateItem = async (endpoint: string, id: string, data: any, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    const response = await api.put(`${endpoint}/${id}`, data);
    setter(prev => prev.map(item => item.id === id ? response.data : item));
  };
  const deleteItem = async (endpoint: string, id: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    await api.delete(`${endpoint}/${id}`);
    setter(prev => prev.filter(item => item.id !== id));
  };

  const getCampaignStats = (): CampaignStats => {
      const relevantLeads = selectedCampaignId ? leads.filter(l => l.campaign_id === selectedCampaignId) : leads;
      const conversions = relevantLeads.filter(l => l.status === 'Converted').length;
      return {
          total_campaigns: campaigns.length,
          total_personas: personas.length,
          total_leads: leads.length,
          total_conversions: leads.filter(l => l.status === 'Converted').length,
          conversion_rate: relevantLeads.length > 0 ? parseFloat(((conversions / relevantLeads.length) * 100).toFixed(1)) : 0,
          avg_conversion_score: relevantLeads.length > 0 ? relevantLeads.reduce((acc, lead) => acc + lead.predicted_conversion_likelihood, 0) / relevantLeads.length : 0,
      };
  };

  const value = {
      campaigns, personas, leads, creativeAssets, adCopy, selectedCampaignId, setSelectedCampaignId, loading, error, getCampaignStats,
      createCampaign: (data: any) => createItem('/campaigns', data, setCampaigns),
      updateCampaign: (id: string, data: any) => updateItem('/campaigns', id, data, setCampaigns),
      deleteCampaign: (id: string) => deleteItem('/campaigns', id, setCampaigns),
      createPersona: (data: any) => createItem('/personas', data, setPersonas),
      updatePersona: (id: string, data: any) => updateItem('/personas', id, data, setPersonas),
      deletePersona: (id: string) => deleteItem('/personas', id, setPersonas),
      createLead: (data: any) => createItem('/leads', data, setLeads),
      updateLead: (id: string, data: any) => updateItem('/leads', id, data, setLeads),
      deleteLead: (id: string) => deleteItem('/leads', id, setLeads),
      bulkImportLeads: async (newLeads: any[]) => {
        await api.post('/leads/bulk', { leads: newLeads });
        fetchData(); // Refetch all data after bulk import
      },
      createCreativeAsset: (data: any) => createItem('/creative-assets', data, setCreativeAssets),
      deleteCreativeAsset: (id: string) => deleteItem('/creative-assets', id, setCreativeAssets),
      createAdCopy: (data: any) => createItem('/ad-copy', data, setAdCopy),
      updateAdCopy: (id: string, data: any) => updateItem('/ad-copy', id, data, setAdCopy),
      deleteAdCopy: (id: string) => deleteItem('/ad-copy', id, setAdCopy),
  };

  return <CampaignsContext.Provider value={value}>{children}</CampaignsContext.Provider>;
};

export const useCampaigns = () => {
  const context = useContext(CampaignsContext);
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignsProvider');
  }
  return context;
};