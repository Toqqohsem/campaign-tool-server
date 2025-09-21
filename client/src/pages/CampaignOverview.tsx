
import { Download, FileText, Users, Target, TrendingUp, Calendar } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';

export default function CampaignOverview() {
  const { 
    campaigns, 
    personas, 
    leads, 
    creativeAssets, 
    adCopy, 
    selectedCampaignId, 
    setSelectedCampaignId 
  } = useCampaigns();

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
  const campaignPersonas = personas.filter(p => p.campaign_id === selectedCampaignId);
  const campaignLeads = leads.filter(l => l.campaign_id === selectedCampaignId);
  const campaignAssets = creativeAssets.filter(a => a.campaign_id === selectedCampaignId);
  const campaignAdCopy = adCopy.filter(ac => ac.campaign_id === selectedCampaignId);

  const conversions = campaignLeads.filter(l => l.status === 'Converted').length;
  const conversionRate = campaignLeads.length > 0 ? (conversions / campaignLeads.length * 100).toFixed(1) : '0.0';
  const avgConversionScore = campaignLeads.length > 0 
    ? (campaignLeads.reduce((sum, lead) => sum + lead.predicted_conversion_likelihood, 0) / campaignLeads.length * 100).toFixed(1)
    : '0.0';

  const exportToPDF = () => {
    // Simulate PDF export - in real app, would generate actual PDF
    const content = `
Campaign Plan: ${selectedCampaign?.name}

Project: ${selectedCampaign?.project}
Objective: ${selectedCampaign?.objective}
Budget: $${selectedCampaign?.budget.toLocaleString()}
Duration: ${selectedCampaign?.start_date} to ${selectedCampaign?.end_date}

Personas (${campaignPersonas.length}):
${campaignPersonas.map(p => `• ${p.name}`).join('\n')}

Performance:
• Total Leads: ${campaignLeads.length}
• Conversions: ${conversions}
• Conversion Rate: ${conversionRate}%
• Avg Conversion Score: ${avgConversionScore}%

Creative Assets: ${campaignAssets.length}
Ad Copy Variations: ${campaignAdCopy.length}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-plan-${selectedCampaign?.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'paused': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Overview</h2>
          <p className="text-gray-600 mt-1">Comprehensive campaign summary and performance</p>
        </div>
        {selectedCampaignId && (
          <button
            onClick={exportToPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Plan</span>
          </button>
        )}
      </div>

      {/* Campaign Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Campaign
        </label>
        <select
          value={selectedCampaignId || ''}
          onChange={(e) => setSelectedCampaignId(e.target.value || null)}
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a campaign</option>
          {campaigns.map(campaign => (
            <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
          ))}
        </select>
      </div>

      {selectedCampaign ? (
        <>
          {/* Campaign Header */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCampaign.name}</h1>
                <p className="text-xl text-gray-700">{selectedCampaign.project}</p>
                <div className="flex items-center space-x-4 mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedCampaign.status)}`}>
                    {selectedCampaign.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    Created {formatDate(selectedCampaign.created_at)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">${selectedCampaign.budget.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Budget</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Objective</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedCampaign.objective}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-gray-700">Duration</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {getDaysRemaining(selectedCampaign.end_date)} days left
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Personas</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 mt-1">{campaignPersonas.length}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 mt-1">{conversionRate}%</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{campaignLeads.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Conversions</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{conversions}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Avg Score</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{avgConversionScore}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Creative Assets</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{campaignAssets.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Personas</h3>
              {campaignPersonas.length === 0 ? (
                <p className="text-gray-600 py-8 text-center">No personas created yet</p>
              ) : (
                <div className="space-y-4">
                  {campaignPersonas.map((persona) => (
                    <div key={persona.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{persona.name}</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Motivations: </span>
                          <span className="text-sm text-gray-900">{persona.key_motivations}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Pain Points: </span>
                          <span className="text-sm text-gray-900">{persona.pain_points}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Status Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Distribution</h3>
              {campaignLeads.length === 0 ? (
                <p className="text-gray-600 py-8 text-center">No leads added yet</p>
              ) : (
                <div className="space-y-3">
                  {['New', 'Contacted', 'Site Visit', 'Hot', 'Converted', 'Rejected'].map((status) => {
                    const statusLeads = campaignLeads.filter(l => l.status === status);
                    const percentage = (statusLeads.length / campaignLeads.length * 100).toFixed(1);
                    
                    if (statusLeads.length === 0) return null;

                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">{status}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-16 text-right">
                            {statusLeads.length} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Asset Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Creative Assets</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Images</span>
                  <span className="font-semibold text-gray-900">
                    {campaignAssets.filter(a => a.type === 'image').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Videos</span>
                  <span className="font-semibold text-gray-900">
                    {campaignAssets.filter(a => a.type === 'video').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ad Copy Variations</span>
                  <span className="font-semibold text-gray-900">{campaignAdCopy.length}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Campaign Start</div>
                    <div className="text-sm text-gray-600">{formatDate(selectedCampaign.start_date)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Campaign End</div>
                    <div className="text-sm text-gray-600">{formatDate(selectedCampaign.end_date)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Last Updated</div>
                    <div className="text-sm text-gray-600">{formatDate(selectedCampaign.updated_at)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a campaign</h3>
          <p className="text-gray-600">Choose a campaign above to view its overview and performance</p>
        </div>
      )}
    </div>
  );
}