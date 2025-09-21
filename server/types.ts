// Copy the content of your existing src/types/index.ts here
// For example:
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
// ...and all your other types (Persona, Lead, etc.)