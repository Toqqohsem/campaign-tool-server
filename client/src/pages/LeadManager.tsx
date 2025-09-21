import React, { useState } from 'react';
import { Upload, Download, Plus, Edit2, Trash2, Search, User, Brain } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import LeadModal from '../components/LeadModal';

export default function LeadManager() {
  const { 
    campaigns, 
    personas, 
    leads, 
    selectedCampaignId, 
    setSelectedCampaignId,
    createLead,
    updateLead,
    deleteLead,
    bulkImportLeads
  } = useCampaigns();
  
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [segmentFilter, setSegmentFilter] = useState<string>('');

  const campaignLeads = selectedCampaignId 
    ? leads.filter(lead => lead.campaign_id === selectedCampaignId)
    : leads;

  const filteredLeads = campaignLeads.filter(lead => {
    const matchesSearch = !searchTerm || 
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesSegment = !segmentFilter || lead.buyer_segment === segmentFilter;
    
    return matchesSearch && matchesStatus && matchesSegment;
  });

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCampaignId) return;

    // Simulate CSV processing - in real app, would parse actual CSV
    const mockLeadsFromCSV = [
      {
        campaign_id: selectedCampaignId,
        persona_id: null,
        first_name: 'Jessica',
        last_name: 'Brown',
        email: 'jessica.brown@email.com',
        phone: '555-0190',
        status: 'New' as const,
        rejection_reason: null,
        age_range: '28-35',
        income_bracket: '$50,000-$75,000',
        family_size: 3,
        occupation: 'Marketing Manager',
        education_level: 'Bachelor\'s Degree',
        bedrooms: 3,
        bathrooms: 2,
        location_area: 'Suburbs',
        budget_min: 300000,
        budget_max: 450000,
        property_type: 'Single Family',
        must_have_features: 'Good Schools, Garage, Backyard',
        interaction_history: 'Filled out online form'
      },
      {
        campaign_id: selectedCampaignId,
        persona_id: null,
        first_name: 'Robert',
        last_name: 'Wilson',
        email: 'robert.wilson@email.com',
        phone: '555-0191',
        status: 'New' as const,
        rejection_reason: null,
        age_range: '42-50',
        income_bracket: '$100,000+',
        family_size: 2,
        occupation: 'Consultant',
        education_level: 'MBA',
        bedrooms: 2,
        bathrooms: 2,
        location_area: 'Downtown',
        budget_min: 600000,
        budget_max: 850000,
        property_type: 'Condo',
        must_have_features: 'City Views, Modern Amenities',
        interaction_history: 'Downloaded brochure'
      }
    ];

    bulkImportLeads(mockLeadsFromCSV);
    event.target.value = ''; // Reset file input
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'text-red-600 bg-red-50 border-red-200';
      case 'Converted': return 'text-green-600 bg-green-50 border-green-200';
      case 'Site Visit': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Contacted': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Rejected': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Luxury Buyer': return 'text-purple-600 bg-purple-50';
      case 'Investor': return 'text-indigo-600 bg-indigo-50';
      case 'First-time Buyer': return 'text-green-600 bg-green-50';
      case 'Upgrader': return 'text-blue-600 bg-blue-50';
      case 'Downsizer': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPersonaName = (personaId: string | null) => {
    if (!personaId) return 'Unassigned';
    return personas.find(p => p.id === personaId)?.name || 'Unknown';
  };

  const handleEditLead = (leadId: string) => {
    setEditingLeadId(leadId);
    setShowLeadModal(true);
  };

  const handleDeleteLead = (leadId: string, leadName: string) => {
    if (window.confirm(`Are you sure you want to delete ${leadName}?`)) {
      deleteLead(leadId);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      // Headers
      [
        'First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Age Range',
        'Income Bracket', 'Family Size', 'Occupation', 'Education Level',
        'Bedrooms', 'Bathrooms', 'Location Area', 'Budget Min', 'Budget Max',
        'Property Type', 'Conversion Score', 'Buyer Segment', 'Persona'
      ].join(','),
      // Data
      ...filteredLeads.map(lead => [
        lead.first_name, lead.last_name, lead.email, lead.phone, lead.status,
        lead.age_range, lead.income_bracket, lead.family_size, lead.occupation,
        lead.education_level, lead.bedrooms, lead.bathrooms, lead.location_area,
        lead.budget_min, lead.budget_max, lead.property_type,
        (lead.predicted_conversion_likelihood * 100).toFixed(1) + '%',
        lead.buyer_segment, getPersonaName(lead.persona_id)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${selectedCampaignId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const statuses = ['New', 'Contacted', 'Site Visit', 'Hot', 'Converted', 'Rejected'];
  const segments = ['First-time Buyer', 'Upgrader', 'Investor', 'Downsizer', 'Luxury Buyer', 'Budget Conscious'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-600 mt-1">Track and manage your leads with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowLeadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Filter
            </label>
            <select
              value={selectedCampaignId || ''}
              onChange={(e) => setSelectedCampaignId(e.target.value || null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All campaigns</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </div>
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Segment Filter
            </label>
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All segments</option>
              {segments.map(segment => (
                <option key={segment} value={segment}>{segment}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CSV Upload */}
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bulk Import
          </label>
          <div className="flex items-center space-x-4">
            <label className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer flex items-center space-x-2 border border-gray-300">
              <Upload className="w-4 h-4" />
              <span>Upload CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
                disabled={!selectedCampaignId}
              />
            </label>
            {!selectedCampaignId && (
              <p className="text-sm text-gray-500">Select a campaign to enable CSV upload</p>
            )}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Lead</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Contact</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Persona</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Score</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Segment</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Budget</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {lead.first_name} {lead.last_name}
                        </div>
                        <div className="text-sm text-gray-600">{lead.age_range}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    <div className="text-sm text-gray-600">{lead.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{getPersonaName(lead.persona_id)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-gray-900">
                        {Math.round(lead.predicted_conversion_likelihood * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSegmentColor(lead.buyer_segment)}`}>
                      {lead.buyer_segment}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      ${lead.budget_min.toLocaleString()} - ${lead.budget_max.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">{lead.property_type}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditLead(lead.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id, `${lead.first_name} ${lead.last_name}`)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter || segmentFilter ? 
                'No leads match your current filters' : 
                'Add your first lead to get started'
              }
            </p>
          </div>
        )}
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <LeadModal
          leadId={editingLeadId}
          onClose={() => {
            setShowLeadModal(false);
            setEditingLeadId(null);
          }}
          onSave={(leadData) => {
            if (editingLeadId) {
              updateLead(editingLeadId, leadData);
            } else if (selectedCampaignId) {
              createLead({ ...leadData, campaign_id: selectedCampaignId });
            }
            setShowLeadModal(false);
            setEditingLeadId(null);
          }}
        />
      )}
    </div>
  );
}