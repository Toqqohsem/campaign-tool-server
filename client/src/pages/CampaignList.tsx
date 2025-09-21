// =============================================================================
// ENHANCED: client/src/pages/CampaignList.tsx
// =============================================================================

import { useState } from 'react';
import { Plus, Trash2, Play, Pause, Eye, Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import CampaignWizard from '../components/CampaignWizard';
import EnhancedButton from '../components/EnhancedButton';
import LoadingSkeleton from '../components/LoadingSkeleton';

interface CampaignListProps {
  onViewChange: (view: string) => void;
  onSelectCampaign: (campaignId: string) => void;
}

export default function CampaignList({ onViewChange, onSelectCampaign }: CampaignListProps) {
  const { campaigns, leads, updateCampaign, deleteCampaign, loading } = useCampaigns();
  const [showWizard, setShowWizard] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'paused': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'active': return 'gradient-success';
      case 'paused': return 'gradient-warning';
      case 'completed': return 'gradient-primary';
      default: return 'bg-gray-500';
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

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gradient">Campaigns</h2>
          <p className="text-gray-600 mt-2 text-lg">Manage and monitor your marketing campaigns</p>
        </div>
        <EnhancedButton
          variant="primary"
          icon={Plus}
          onClick={() => setShowWizard(true)}
          size="lg"
        >
          New Campaign
        </EnhancedButton>
      </div>

      {/* Campaign Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-elevated rounded-xl p-6 text-center">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{campaigns.length}</h3>
          <p className="text-gray-600 font-medium">Total Campaigns</p>
        </div>
        
        <div className="card-elevated rounded-xl p-6 text-center">
          <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center mx-auto mb-4">
            <Play className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {campaigns.filter(c => c.status === 'active').length}
          </h3>
          <p className="text-gray-600 font-medium">Active</p>
        </div>
        
        <div className="card-elevated rounded-xl p-6 text-center">
          <div className="w-12 h-12 gradient-warning rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{leads.length}</h3>
          <p className="text-gray-600 font-medium">Total Leads</p>
        </div>
        
        <div className="card-elevated rounded-xl p-6 text-center">
          <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            ${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
          </h3>
          <p className="text-gray-600 font-medium">Total Budget</p>
        </div>
      </div>

      {/* Enhanced Campaigns Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <LoadingSkeleton type="card" count={6} />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No campaigns yet</h3>
          <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
            Create your first campaign to start building your marketing strategy
          </p>
          <EnhancedButton
            variant="primary"
            icon={Plus}
            onClick={() => setShowWizard(true)}
            size="lg"
          >
            Create Your First Campaign
          </EnhancedButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {campaigns.map((campaign) => {
            const leadCount = getCampaignLeadCount(campaign.id);
            const conversions = getCampaignConversions(campaign.id);
            const conversionRate = leadCount > 0 ? (conversions / leadCount * 100).toFixed(1) : '0.0';
            const daysRemaining = getDaysRemaining(campaign.end_date);

            return (
              <div 
                key={campaign.id} 
                className="card-elevated rounded-2xl p-6 group hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Campaign Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {campaign.name}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(campaign.status)}`}>
                        <div className={`w-2 h-2 ${getStatusGradient(campaign.status)} rounded-full mr-2`}></div>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium">{campaign.project}</p>
                    <p className="text-sm text-gray-500 mt-1">{campaign.objective}</p>
                  </div>
                </div>

                {/* Campaign Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Leads</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{leadCount}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Conv. Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Budget:</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">${campaign.budget.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Duration:</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ended'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Period:</span>
                    <span className="text-sm text-gray-600">
                      {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="text-gray-500">{conversions}/{leadCount} converted</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="progress-bar h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${conversionRate}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onSelectCampaign(campaign.id);
                      onViewChange('overview');
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 px-4 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center space-x-2 border border-blue-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  <button
                    onClick={() => handleStatusToggle(campaign.id, campaign.status)}
                    className={`px-4 py-3 rounded-xl transition-all duration-200 font-semibold border-2 ${
                      campaign.status === 'active' 
                        ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
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
                    className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-xl transition-all duration-200 font-semibold border-2 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}