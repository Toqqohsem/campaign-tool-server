import { BarChart3, Users, Target, TrendingUp } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EnhancedButton from '../components/EnhancedButton';

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
      {/* Loading State - ENHANCED */}
      {loading && (
        <div className="gradient-primary rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            <span className="text-white font-medium">Loading campaign data...</span>
          </div>
        </div>
      )}

      {/* Error State - ENHANCED */}
      {error && (
        <div className="gradient-warning rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xs font-bold">!</span>
            </div>
            <span className="text-white font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Header - ENHANCED */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gradient">Dashboard</h2>
          <p className="text-gray-600 mt-2 text-lg">Campaign performance overview</p>
        </div>
        <EnhancedButton 
          variant="primary" 
          icon={Target}
          onClick={() => onViewChange('campaigns')}
        >
          Create Campaign
        </EnhancedButton>
      </div>

      {/* Stats Grid - YOU DID THIS PERFECTLY! ✅ */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <LoadingSkeleton type="stat" count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Campaigns"
            value={stats.total_campaigns}
            change="+12%"
            trend="up"
            icon={Target}
            gradient="primary"
          />
          <StatCard
            title="Active Personas"
            value={stats.total_personas}
            change="+8%"
            trend="up"
            icon={Users}
            gradient="success"
          />
          <StatCard
            title="Total Leads"
            value={stats.total_leads}
            change="+24%"
            trend="up"
            icon={TrendingUp}
            gradient="warning"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversion_rate}%`}
            change="+5.2%"
            trend="up"
            icon={BarChart3}
            gradient="secondary"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns - ENHANCED */}
        <div className="card-elevated rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Active Campaigns</h3>
            <button
              onClick={() => onViewChange('campaigns')}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-all duration-200"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                <div>
                  <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-600">{campaign.project}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    ● {campaign.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1 font-medium">${campaign.budget.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {activeCampaigns.length === 0 && (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No active campaigns</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Leads - ENHANCED */}
        <div className="card-elevated rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Leads</h3>
            <button
              onClick={() => onViewChange('leads')}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-all duration-200"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {lead.first_name.charAt(0)}{lead.last_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{lead.first_name} {lead.last_name}</h4>
                    <p className="text-sm text-gray-600">{lead.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1 font-medium">{Math.round(lead.predicted_conversion_likelihood * 100)}% score</p>
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No recent leads</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions - ENHANCED */}
      <div className="card-elevated rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onViewChange('campaigns')}
            className="group p-6 text-left border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-blue-50"
          >
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Create Campaign</h4>
            <p className="text-sm text-gray-600">Start a new marketing campaign</p>
          </button>
          
          <button
            onClick={() => onViewChange('personas')}
            className="group p-6 text-left border-2 border-gray-200 rounded-xl hover:border-teal-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-teal-50"
          >
            <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Build Personas</h4>
            <p className="text-sm text-gray-600">Define your target audience</p>
          </button>
          
          <button
            onClick={() => onViewChange('leads')}
            className="group p-6 text-left border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-orange-50"
          >
            <div className="w-12 h-12 gradient-warning rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Import Leads</h4>
            <p className="text-sm text-gray-600">Add leads from CSV file</p>
          </button>
        </div>
      </div>
    </div>
  );
}