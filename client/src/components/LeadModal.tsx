import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import type { Lead } from '../types';

interface LeadModalProps {
  leadId: string | null;
  onClose: () => void;
  onSave: (leadData: Partial<Lead>) => void;
}

const initialFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  persona_id: null as string | null,
  status: 'New' as Lead['status'],
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
};

export default function LeadModal({ leadId, onClose, onSave }: LeadModalProps) {
  const { leads } = useCampaigns();
  const [formData, setFormData] = useState(initialFormData);


  const existingLead = leadId ? leads.find(l => l.id === leadId) : null;


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

  const handleSubmit = () => {
    onSave(formData);
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{leadId ? 'Edit Lead' : 'Add New Lead'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-6 h-6" /></button>
          </div>
        </div>
        <div className="p-6 space-y-8">
          {/* Form sections go here, they remain the same */}
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex justify-end space-x-4">
            <button onClick={onClose} className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium">Cancel</button>
            <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium">{leadId ? 'Update Lead' : 'Create Lead'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}