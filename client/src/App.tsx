// client/src/App.tsx
import { useState } from 'react';
import { CampaignsProvider } from './hooks/useCampaigns';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CampaignList from './components/CampaignList';
import PersonaCreator from './components/PersonaCreator';
import AssetOrganizer from './components/AssetOrganizer';
import LeadManager from './components/LeadManager';
import PredictiveInsights from './components/PredictiveInsights';
import CampaignOverview from './components/CampaignOverview';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    if (view === 'overview' && !selectedCampaignId) {
      // Don't go to overview if no campaign is selected
      setCurrentView('campaigns');
    } else {
      setCurrentView(view);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'campaigns': return <CampaignList onViewChange={handleViewChange} onSelectCampaign={setSelectedCampaignId} />;
      case 'overview': return <CampaignOverview />;
      case 'personas': return <PersonaCreator />;
      case 'assets': return <AssetOrganizer />;
      case 'leads': return <LeadManager />;
      case 'insights': return <PredictiveInsights />;
      default: return <Dashboard onViewChange={handleViewChange} />;
    }
  };

  return (
    <CampaignsProvider>
      <Layout currentView={currentView} onViewChange={handleViewChange}>
        {renderView()}
      </Layout>
    </CampaignsProvider>
  );
}

export default App;