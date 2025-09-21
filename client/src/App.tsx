// client/src/App.tsx
import { useState } from 'react';
import { CampaignsProvider } from './hooks/useCampaigns.tsx';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import CampaignList from './pages/CampaignList.tsx';
import PersonaCreator from './pages/PersonaCreator.tsx';
import AssetOrganizer from './pages/AssetOrganizer.tsx';
import LeadManager from './pages/LeadManager.tsx';
import PredictiveInsights from './pages/PredictiveInsights.tsx';
import CampaignOverview from './pages/CampaignOverview.tsx';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    if (view === 'overview' && !selectedCampaignId) {
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