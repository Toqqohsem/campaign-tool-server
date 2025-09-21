// Copy the content of src/types/index.ts here
export interface Campaign {
  id: string;
  name: string;
  project: string;
  objective: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Persona {
  id: string;
  campaign_id: string;
  name: string;
  key_motivations: string;
  pain_points: string;
  created_at: string;
  updated_at: string;
}

export interface CreativeAsset {
  id: string;
  campaign_id: string;
  persona_id: string;
  type: 'image' | 'video';
  filename: string;
  url: string;
  created_at: string;
}

export interface AdCopy {
  id: string;
  campaign_id: string;
  persona_id: string;
  headline: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  campaign_id: string;
  persona_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Site Visit' | 'Hot' | 'Converted' | 'Rejected';
  rejection_reason: 'Price' | 'Location' | 'Layout' | 'Not Responsive' | null;
  age_range: string;
  income_bracket: string;
  family_size: number;
  occupation: string;
  education_level: string;
  bedrooms: number;
  bathrooms: number;
  location_area: string;
  budget_min: number;
  budget_max: number;
  property_type: string;
  must_have_features: string;
  interaction_history: string;
  predicted_conversion_likelihood: number;
  buyer_segment: 'First-time Buyer' | 'Upgrader' | 'Investor' | 'Downsizer' | 'Luxury Buyer' | 'Budget Conscious';
  created_at: string;
  updated_at: string;
}

export interface CampaignStats {
  total_campaigns: number;
  total_personas: number;
  total_leads: number;
  total_conversions: number;
  conversion_rate: number;
  avg_conversion_score: number;
  high_value_leads: number;
}

export interface BuyerSegment {
  segment: string;
  count: number;
  percentage: number;
}

export interface PropertyPreference {
  property_type: string;
  count: number;
  avg_budget: number;
}

export interface AgeGroup {
  age_range: string;
  count: number;
  conversion_rate: number;
}
