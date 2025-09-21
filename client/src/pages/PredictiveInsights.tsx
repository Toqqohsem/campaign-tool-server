import React from 'react';
import { Brain, TrendingUp, Users, Target, Star, AlertCircle } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import { mlApi } from '../services/api';

export default function PredictiveInsights() {
  const { leads, selectedCampaignId, setSelectedCampaignId, campaigns, getCampaignStats } = useCampaigns();
  const [recommendations, setRecommendations] = React.useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = React.useState(false);
  
  const campaignLeads = selectedCampaignId 
    ? leads.filter(lead => lead.campaign_id === selectedCampaignId)
    : leads;

  const stats = getCampaignStats();

  // Load ML recommendations
  React.useEffect(() => {
    const loadRecommendations = async () => {
      if (campaignLeads.length === 0) {
        setRecommendations([]);
        return;
      }

      setLoadingRecommendations(true);
      try {
        const response = await mlApi.getRecommendations(selectedCampaignId || undefined);
        setRecommendations(response.data.recommendations);
      } catch (error) {
        console.error('Error loading ML recommendations:', error);
        // Fallback to local recommendations
        const { generateMLRecommendations } = await import('../utils/mlModel.ts');
        setRecommendations(generateMLRecommendations(campaignLeads));
      } finally {
        setLoadingRecommendations(false);
      }
    };

    loadRecommendations();
  }, [campaignLeads, selectedCampaignId]);
  // Calculate buyer segment distribution
  const buyerSegments = campaignLeads.reduce((acc, lead) => {
    const segment = lead.buyer_segment;
    acc[segment] = (acc[segment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const buyerSegmentData = Object.entries(buyerSegments).map(([segment, count]) => ({
    segment,
    count,
    percentage: Math.round((count / campaignLeads.length) * 100)
  }));

  // High-value leads (70%+ conversion score)
  const highValueLeads = campaignLeads.filter(lead => lead.predicted_conversion_likelihood >= 0.7);

  // Property preferences analysis
  const propertyPreferences = campaignLeads.reduce((acc, lead) => {
    const type = lead.property_type;
    if (!acc[type]) {
      acc[type] = { count: 0, totalBudget: 0 };
    }
    acc[type].count += 1;
    acc[type].totalBudget += (lead.budget_min + lead.budget_max) / 2;
    return acc;
  }, {} as Record<string, { count: number; totalBudget: number }>);

  const propertyData = Object.entries(propertyPreferences).map(([type, data]) => ({
    property_type: type,
    count: data.count,
    avg_budget: Math.round(data.totalBudget / data.count)
  }));

  // Age demographics with conversion rates
  const ageGroups = campaignLeads.reduce((acc, lead) => {
    const age = lead.age_range;
    if (!acc[age]) {
      acc[age] = { count: 0, conversions: 0 };
    }
    acc[age].count += 1;
    if (lead.status === 'Converted') {
      acc[age].conversions += 1;
    }
    return acc;
  }, {} as Record<string, { count: number; conversions: number }>);

  const ageData = Object.entries(ageGroups).map(([age, data]) => ({
    age_range: age,
    count: data.count,
    conversion_rate: data.count > 0 ? Math.round((data.conversions / data.count) * 100) : 0
  }));

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Luxury Buyer': return 'bg-purple-100 text-purple-800';
      case 'Investor': return 'bg-indigo-100 text-indigo-800';
      case 'First-time Buyer': return 'bg-green-100 text-green-800';
      case 'Upgrader': return 'bg-blue-100 text-blue-800';
      case 'Downsizer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Predictive Insights</h2>
          <p className="text-gray-600 mt-1">AI-powered analytics and lead intelligence</p>
        </div>
      </div>

      {/* Campaign Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Campaign for Analysis
        </label>
        <select
          value={selectedCampaignId || ''}
          onChange={(e) => setSelectedCampaignId(e.target.value || null)}
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All campaigns</option>
          {campaigns.map(campaign => (
            <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
          ))}
        </select>
      </div>

      {campaignLeads.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
          <p className="text-gray-600">
            {selectedCampaignId ? 'No leads found for this campaign' : 'Create campaigns and add leads to see insights'}
          </p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Avg Conversion Score</h3>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(stats.avg_conversion_score * 100)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">High-Value Leads</h3>
                  <p className="text-2xl font-bold text-gray-900">{highValueLeads.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Buyer Segments</h3>
                  <p className="text-2xl font-bold text-gray-900">{buyerSegmentData.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
                  <p className="text-2xl font-bold text-gray-900">{campaignLeads.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ML Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                  {loadingRecommendations ? (
                    <div className="animate-spin w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full" />
                  ) : (
                    <Brain className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    AI Recommendations {loadingRecommendations && '(Loading...)'}
                  </h3>
                  <ul className="space-y-2">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5" />
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Buyer Segment Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Segment Distribution</h3>
              <div className="space-y-4">
                {buyerSegmentData.map((segment) => (
                  <div key={segment.segment} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSegmentColor(segment.segment)}`}>
                        {segment.segment}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${segment.percentage}%` }}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900 w-12 text-right">
                        {segment.count} ({segment.percentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Value Leads */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">High-Value Leads (70%+ Score)</h3>
              {highValueLeads.length === 0 ? (
                <p className="text-gray-600 py-8 text-center">No high-value leads identified</p>
              ) : (
                <div className="space-y-3">
                  {highValueLeads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {lead.first_name} {lead.last_name}
                        </div>
                        <div className="text-sm text-gray-600">{lead.buyer_segment}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {Math.round(lead.predicted_conversion_likelihood * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">{lead.status}</div>
                      </div>
                    </div>
                  ))}
                  {highValueLeads.length > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      +{highValueLeads.length - 5} more high-value leads
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Property Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Preferences</h3>
              <div className="space-y-4">
                {propertyData.map((property) => (
                  <div key={property.property_type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                      <span className="font-medium text-gray-900">{property.property_type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{property.count} leads</div>
                      <div className="text-sm text-gray-600">${property.avg_budget.toLocaleString()} avg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Demographics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Demographics & Conversion</h3>
              <div className="space-y-4">
                {ageData.map((age) => (
                  <div key={age.age_range} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{age.age_range}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{age.count} leads</div>
                        <div className="text-sm text-gray-600">{age.conversion_rate}% conversion</div>
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${age.conversion_rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}