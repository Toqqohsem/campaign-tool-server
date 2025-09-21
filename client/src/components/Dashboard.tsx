import React from 'react';
import { BarChart3, Users, Target, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export default function Dashboard({ onViewChange }: DashboardProps) {
  const { campaigns, leads, getCampaignStats, loading, error } = useCampaigns();
  const stats = getCampaignStats();

  const recentLeads = leads
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const activeCampaigns = campaigns.filter(c => c.status === 'active');

  const statCards = [
    {
      title: 'Total Campaigns',
      value: stats.total_campaigns,
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Active Personas',
      value: stats.total_personas,
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'teal'
    },
    {
      title: 'Total Leads',
      value: stats.total_leads,
      change: '+24%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversion_rate}%`,
      change: '+5.2%',
      trend: 'up',
      icon: BarChart3,
      color: 'green'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'text-red-600 bg-red-50 border-red-200';
      case 'Converted': return 'text-green-600 bg-green-50 border-green-200';
      case 'Site Visit': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Contacted': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Rejected': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span className="text-blue-800">Loading campaign data...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
            <span className="text-orange-800">{error}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Campaign performance overview</p>
        </div>
        <button
          onClick={() => onViewChange('campaigns')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          Create Campaign
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'text-blue-600 bg-blue-50',
            teal: 'text-teal-600 bg-teal-50',
            orange: 'text-orange-600 bg-orange-50',
            green: 'text-green-600 bg-green-50'
          };

          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
            <button
              onClick={() => onViewChange('campaigns')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-600">{campaign.project}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {campaign.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">${campaign.budget.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {activeCampaigns.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active campaigns</p>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
            <button
              onClick={() => onViewChange('leads')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{lead.first_name} {lead.last_name}</h4>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{Math.round(lead.predicted_conversion_likelihood * 100)}% score</p>
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent leads</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onViewChange('campaigns')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Target className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Campaign</h4>
            <p className="text-sm text-gray-600">Start a new marketing campaign</p>
          </button>
          <button
            onClick={() => onViewChange('personas')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Users className="w-8 h-8 text-teal-600 mb-2" />
            <h4 className="font-medium text-gray-900">Build Personas</h4>
            <p className="text-sm text-gray-600">Define your target audience</p>
          </button>
          <button
            onClick={() => onViewChange('leads')}
            className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-900">Import Leads</h4>
            <p className="text-sm text-gray-600">Add leads from CSV file</p>
          </button>
        </div>
      </div>
    </div>
  );
}