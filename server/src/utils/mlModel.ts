// Copy the content of src/utils/mlModel.ts here
import { Lead } from '../types';

export function calculateLeadScore(lead: Lead): {
  score: number;
  segment: 'First-time Buyer' | 'Upgrader' | 'Investor' | 'Downsizer' | 'Luxury Buyer' | 'Budget Conscious';
} {
  let score = 0.5; // Base score

  // Status scoring
  switch (lead.status) {
    case 'Hot':
      score += 0.3;
      break;
    case 'Site Visit':
      score += 0.2;
      break;
    case 'Contacted':
      score += 0.1;
      break;
    case 'Converted':
      score = 1.0;
      break;
    case 'Rejected':
      score = Math.max(0.1, score - 0.4);
      break;
    default:
      break;
  }

  // Income bracket scoring
  switch (lead.income_bracket) {
    case '$100,000+':
      score += 0.15;
      break;
    case '$75,000-$100,000':
      score += 0.1;
      break;
    case '$50,000-$75,000':
      score += 0.05;
      break;
    default:
      break;
  }

  // Budget alignment scoring
  const budgetRange = lead.budget_max - lead.budget_min;
  if (budgetRange > 200000) {
    score += 0.1; // Flexible budget
  }
  if (lead.budget_max > 500000) {
    score += 0.05; // High budget
  }

  // Education level scoring
  switch (lead.education_level) {
    case 'MBA':
    case 'Master\'s Degree':
      score += 0.08;
      break;
    case 'Bachelor\'s Degree':
      score += 0.05;
      break;
    default:
      break;
  }

  // Interaction history scoring
  const interactionCount = lead.interaction_history.split(',').length;
  score += Math.min(0.1, interactionCount * 0.02);

  // Property type preference scoring
  if (lead.property_type === 'Investment' && lead.occupation.toLowerCase().includes('investor')) {
    score += 0.1;
  }

  // Ensure score is between 0 and 1
  score = Math.max(0, Math.min(1, score));

  // Determine buyer segment
  let segment: 'First-time Buyer' | 'Upgrader' | 'Investor' | 'Downsizer' | 'Luxury Buyer' | 'Budget Conscious';

  if (lead.property_type === 'Investment') {
    segment = 'Investor';
  } else if (lead.budget_max > 750000) {
    segment = 'Luxury Buyer';
  } else if (lead.age_range === '55-64' || lead.age_range === '65+') {
    segment = 'Downsizer';
  } else if (lead.budget_max < 300000) {
    segment = 'Budget Conscious';
  } else if (lead.family_size > 2 && (lead.age_range === '35-44' || lead.age_range === '45-54')) {
    segment = 'Upgrader';
  } else {
    segment = 'First-time Buyer';
  }

  return { score: Math.round(score * 100) / 100, segment };
}

export function generateMLRecommendations(leads: Lead[]): string[] {
  const recommendations: string[] = [];
  
  const highValueLeads = leads.filter(lead => lead.predicted_conversion_likelihood > 0.7);
  const hotLeads = leads.filter(lead => lead.status === 'Hot');
  const siteVisitLeads = leads.filter(lead => lead.status === 'Site Visit');
  
  if (highValueLeads.length > 0) {
    recommendations.push(`Focus on ${highValueLeads.length} high-value leads with 70%+ conversion probability`);
  }
  
  if (hotLeads.length > 2) {
    recommendations.push(`Immediate follow-up needed for ${hotLeads.length} hot leads`);
  }
  
  if (siteVisitLeads.length > 0) {
    recommendations.push(`Schedule follow-up calls with ${siteVisitLeads.length} leads who visited the site`);
  }
  
  const budgetConsciousCount = leads.filter(lead => lead.buyer_segment === 'Budget Conscious').length;
  if (budgetConsciousCount > leads.length * 0.3) {
    recommendations.push('Consider offering financing incentives for budget-conscious segment');
  }
  
  const luxuryCount = leads.filter(lead => lead.buyer_segment === 'Luxury Buyer').length;
  if (luxuryCount > 0) {
    recommendations.push(`Highlight premium features and amenities for ${luxuryCount} luxury buyers`);
  }
  
  return recommendations;
}
