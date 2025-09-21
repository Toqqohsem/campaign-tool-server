import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Play, Pause, Eye } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import CampaignWizard from './CampaignWizard';

interface CampaignListProps {
  onViewChange: (view: string) => void;
  onSelectCampaign: (campaignId: string) => void;
}

export default function CampaignList({ onViewChange, onSelectCampaign }: CampaignListProps) {
  const { campaigns, leads, updateCampaign, deleteCampaign } = useCampaigns();
  const [showWizard, setShowWizard] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'paused': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCampaignLeadCount = (campaignId: string) => {
    return leads.filter(lead => lead.campaign_id === campaignId).length;
  };

  const getCampaignConversions = (campaignId: string) => {
    return leads.filter(lead => lead.campaign_id === campaignId && lead.status === 'Converted').length;
  };

  const handleStatusToggle = (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateCampaign(campaignId, { status: newStatus });
  };

  const handleDeleteCampaign = (campaignId: string, campaignName: string) => {
    if (window.confirm(`Are you sure you want to delete "${campaignName}"? This will also delete all associated personas, assets, and leads.`)) {
      deleteCampaign(campaignId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showWizard) {
    return (
      <CampaignWizard
        onComplete={() => setShowWizard(false)}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaigns</h2>
          <p className="text-gray-600 mt-1">Manage your marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map((campaign) => {
          const leadCount = getCampaignLeadCount(campaign.id);
          const conversions = getCampaignConversions(campaign.id);
          const conversionRate = leadCount > 0 ? (conversions / leadCount * 100).toFixed(1) : '0.0';

          return (
            <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                  <p className="text-gray-600 text-sm">{campaign.project}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900">{leadCount}</div>
                  <div className="text-xs text-gray-600">Leads</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
                  <div className="text-xs text-gray-600">Conversion Rate</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Objective:</span>
                  <span className="text-gray-900 font-medium">{campaign.objective}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget:</span>
                  <span className="text-gray-900 font-medium">${campaign.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onSelectCampaign(campaign.id);
                    onViewChange('overview');
                  }}
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleStatusToggle(campaign.id, campaign.status)}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    campaign.status === 'active' 
                      ? 'bg-orange-50 hover:bg-orange-100 text-orange-600'
                      : 'bg-green-50 hover:bg-green-100 text-green-600'
                  }`}
                >
                  {campaign.status === 'active' ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600 mb-4">Create your first campaign to get started</p>
          <button
            onClick={() => setShowWizard(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            Create Campaign
          </button>
        </div>
      )}
    </div>
  );
}