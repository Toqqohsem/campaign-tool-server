import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Home, DollarSign, MessageSquare } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';

interface LeadModalProps {
  leadId: string | null;
  onClose: () => void;
  onSave: (leadData: any) => void;
}

export default function LeadModal({ leadId, onClose, onSave }: LeadModalProps) {
  const { leads, personas, selectedCampaignId } = useCampaigns();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    persona_id: null as string | null,
    status: 'New' as const,
    rejection_reason: null as string | null,
    age_range: '',
    income_bracket: '',
    family_size: 1,
    occupation: '',
    education_level: '',
    bedrooms: 1,
    bathrooms: 1,
    location_area: '',
    budget_min: 0,
    budget_max: 0,
    property_type: '',
    must_have_features: '',
    interaction_history: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const existingLead = leadId ? leads.find(l => l.id === leadId) : null;
  const campaignPersonas = personas.filter(p => p.campaign_id === selectedCampaignId);

  useEffect(() => {
    if (existingLead) {
      setFormData({
        first_name: existingLead.first_name,
        last_name: existingLead.last_name,
        email: existingLead.email,
        phone: existingLead.phone,
        persona_id: existingLead.persona_id,
        status: existingLead.status,
        rejection_reason: existingLead.rejection_reason,
        age_range: existingLead.age_range,
        income_bracket: existingLead.income_bracket,
        family_size: existingLead.family_size,
        occupation: existingLead.occupation,
        education_level: existingLead.education_level,
        bedrooms: existingLead.bedrooms,
        bathrooms: existingLead.bathrooms,
        location_area: existingLead.location_area,
        budget_min: existingLead.budget_min,
        budget_max: existingLead.budget_max,
        property_type: existingLead.property_type,
        must_have_features: existingLead.must_have_features,
        interaction_history: existingLead.interaction_history
      });
    }
  }, [existingLead]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.budget_min >= formData.budget_max) newErrors.budget_max = 'Max budget must be greater than min budget';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const statuses = ['New', 'Contacted', 'Site Visit', 'Hot', 'Converted', 'Rejected'];
  const rejectionReasons = ['Price', 'Location', 'Layout', 'Not Responsive'];
  const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  const incomeBrackets = ['$0-$25,000', '$25,000-$50,000', '$50,000-$75,000', '$75,000-$100,000', '$100,000+'];
  const educationLevels = ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'MBA', 'PhD'];
  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Investment', 'Commercial'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {leadId ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.first_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.last_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Persona
                </label>
                <select
                  value={formData.persona_id || ''}
                  onChange={(e) => updateFormData('persona_id', e.target.value || null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Unassigned</option>
                  {campaignPersonas.map(persona => (
                    <option key={persona.id} value={persona.id}>{persona.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateFormData('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {formData.status === 'Rejected' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason
                  </label>
                  <select
                    value={formData.rejection_reason || ''}
                    onChange={(e) => updateFormData('rejection_reason', e.target.value || null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select reason</option>
                    {rejectionReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">Demographics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <select
                  value={formData.age_range}
                  onChange={(e) => updateFormData('age_range', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select age range</option>
                  {ageRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Income Bracket
                </label>
                <select
                  value={formData.income_bracket}
                  onChange={(e) => updateFormData('income_bracket', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select income bracket</option>
                  {incomeBrackets.map(bracket => (
                    <option key={bracket} value={bracket}>{bracket}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Size
                </label>
                <input
                  type="number"
                  value={formData.family_size}
                  onChange={(e) => updateFormData('family_size', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => updateFormData('occupation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <select
                  value={formData.education_level}
                  onChange={(e) => updateFormData('education_level', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select education level</option>
                  {educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Property Preferences */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Property Preferences</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value) || 1)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => updateFormData('bathrooms', parseInt(e.target.value) || 1)}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Area
                </label>
                <input
                  type="text"
                  value={formData.location_area}
                  onChange={(e) => updateFormData('location_area', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Downtown, Suburbs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={formData.property_type}
                  onChange={(e) => updateFormData('property_type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Budget Range</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Budget
                </label>
                <input
                  type="number"
                  value={formData.budget_min}
                  onChange={(e) => updateFormData('budget_min', parseInt(e.target.value) || 0)}
                  min="0"
                  step="10000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Budget
                </label>
                <input
                  type="number"
                  value={formData.budget_max}
                  onChange={(e) => updateFormData('budget_max', parseInt(e.target.value) || 0)}
                  min="0"
                  step="10000"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.budget_max ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.budget_max && <p className="mt-1 text-sm text-red-600">{errors.budget_max}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Must-Have Features
              </label>
              <input
                type="text"
                value={formData.must_have_features}
                onChange={(e) => updateFormData('must_have_features', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Garage, Pool, Modern Kitchen"
              />
            </div>
          </div>

          {/* Interaction History */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Interaction History</h3>
            </div>

            <div>
              <textarea
                value={formData.interaction_history}
                onChange={(e) => updateFormData('interaction_history', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Notes about interactions, touchpoints, interests..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              {leadId ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}