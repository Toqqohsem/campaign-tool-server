import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Brain, AlertCircle } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';

export default function PersonaCreator() {
  const { campaigns, personas, selectedCampaignId, setSelectedCampaignId, createPersona, updatePersona, deletePersona } = useCampaigns();
  const [showForm, setShowForm] = useState(false);
  const [editingPersona, setEditingPersona] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    key_motivations: '',
    pain_points: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
  const campaignPersonas = personas.filter(p => p.campaign_id === selectedCampaignId);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Persona name is required';
    }
    if (!formData.key_motivations.trim()) {
      newErrors.key_motivations = 'Key motivations are required';
    }
    if (!formData.pain_points.trim()) {
      newErrors.pain_points = 'Pain points are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!selectedCampaignId) return;
    
    if (validateForm()) {
      if (editingPersona) {
        updatePersona(editingPersona, formData);
      } else {
        createPersona({
          ...formData,
          campaign_id: selectedCampaignId
        });
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', key_motivations: '', pain_points: '' });
    setErrors({});
    setShowForm(false);
    setEditingPersona(null);
  };

  const handleEdit = (persona: any) => {
    setFormData({
      name: persona.name,
      key_motivations: persona.key_motivations,
      pain_points: persona.pain_points
    });
    setEditingPersona(persona.id);
    setShowForm(true);
  };

  const handleDelete = (personaId: string, personaName: string) => {
    if (window.confirm(`Are you sure you want to delete "${personaName}"? This will also remove all associated assets and ad copy.`)) {
      deletePersona(personaId);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Persona Creator</h2>
          <p className="text-gray-600 mt-1">Define your target audience personas</p>
        </div>
        {selectedCampaignId && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Persona</span>
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a campaign</option>
          {campaigns.map(campaign => (
            <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
          ))}
        </select>
      </div>

      {selectedCampaignId && (
        <>
          {/* Requirements Notice */}
          {campaignPersonas.length < 2 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-orange-800">Minimum Personas Required</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Each campaign needs at least 2-3 detailed personas for effective targeting. 
                    You currently have {campaignPersonas.length} persona{campaignPersonas.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Persona Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingPersona ? 'Edit Persona' : 'Create New Persona'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Persona Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Young Professional, Growing Family"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Motivations *
                  </label>
                  <textarea
                    value={formData.key_motivations}
                    onChange={(e) => updateFormData('key_motivations', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.key_motivations ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="What drives this persona to make decisions? What are their goals?"
                  />
                  {errors.key_motivations && <p className="mt-1 text-sm text-red-600">{errors.key_motivations}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pain Points *
                  </label>
                  <textarea
                    value={formData.pain_points}
                    onChange={(e) => updateFormData('pain_points', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.pain_points ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="What challenges or concerns does this persona have?"
                  />
                  {errors.pain_points && <p className="mt-1 text-sm text-red-600">{errors.pain_points}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {editingPersona ? 'Update Persona' : 'Create Persona'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Personas List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignPersonas.map((persona) => (
              <div key={persona.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{persona.name}</h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEdit(persona)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(persona.id, persona.name)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-4 h-4 text-green-600" />
                      <h4 className="text-sm font-medium text-gray-900">Key Motivations</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{persona.key_motivations}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <h4 className="text-sm font-medium text-gray-900">Pain Points</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{persona.pain_points}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Created {new Date(persona.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {campaignPersonas.length === 0 && !showForm && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No personas created yet</h3>
              <p className="text-gray-600 mb-4">Create 2-3 detailed personas for "{selectedCampaign?.name}"</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Create First Persona
              </button>
            </div>
          )}
        </>
      )}

      {!selectedCampaignId && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a campaign</h3>
          <p className="text-gray-600">Choose a campaign above to create personas</p>
        </div>
      )}
    </div>
  );
}