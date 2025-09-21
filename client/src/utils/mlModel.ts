// client/src/utils/mlModel.ts
import type { Lead } from '../types';

// This is a simplified local fallback for the ML recommendations
export function generateMLRecommendations(leads: Lead[]): string[] {
  const recommendations: string[] = [];
  const highValueLeads = leads.filter(lead => lead.predicted_conversion_likelihood > 0.7);

  if (highValueLeads.length > 0) {
    recommendations.push(`Focus on ${highValueLeads.length} high-value leads with 70%+ conversion probability.`);
  } else {
    recommendations.push("Consider running a re-engagement campaign for older leads.");
  }
  return recommendations;
}