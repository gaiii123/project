// services/types.ts
export interface Beneficiary {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  needs_description: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: number;
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  purpose?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  target_amount: number;
  collected_amount: number;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
  progress_percentage?: number;
}

export interface ImpactRecord {
  id: number;
  project_id?: number;
  beneficiary_id?: number;
  donation_id?: number;
  impact_description: string;
  amount_used?: number;
  status_update: string;
  created_at: string;
  project_name?: string;
  beneficiary_name?: string;
  donor_name?: string;
  donation_amount?: number;
}

export interface DonationStats {
  totalAmount: number;
  totalDonations: number;
  averageDonation: number;
}

export interface ImpactSummary {
  beneficiaries_helped: number;
  active_projects: number;
  total_funds_utilized: number;
  total_impact_records: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}