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

export interface Application {
  id: number;
  project_id: number;
  beneficiary_id: number;
  application_type: string;
  description: string;
  amount_requested?: number;
  items_requested?: string;
  reason?: string;
  voice_recording_url?: string;
  documents?: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  reviewed_by?: number;
  review_notes?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  beneficiary_name?: string;
  beneficiary_email?: string;
  beneficiary_phone?: string;
  beneficiary_location?: string;
  project_title?: string;
  project_description?: string;
  project_category?: string;
  reviewed_by_name?: string;
}

export interface Donation {
  id: number;
  project_id: number;
  donor_id: number;
  amount: number;
  currency: string;
  purpose?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  // Joined fields
  donor_name?: string;
  donor_email?: string;
  project_title?: string;
  project_category?: string;
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

export interface BeneficiaryDashboardData {
  totalDonations: number;
  categories: {
    name: string;
    count: number;
    amount: number;
    color: string;
  }[];
  recentActivities: {
    id: number;
    type: 'approved' | 'review' | 'submitted' | 'rejected';
    title: string;
    subtitle: string;
    timestamp: string;
  }[];
  applicationStats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

export interface DonorImpactStats {
  projects_supported: number;
  total_donated: number;
  avg_donation: number;
  beneficiaries_impacted: number;
  impact_records_count: number;
}

export interface DonorImpactHistory {
  donation_id: number;
  amount: number;
  donation_date: string;
  status: string;
  project_title: string;
  project_category: string;
  impact_description?: string;
  status_update?: string;
  amount_used?: number;
  impact_date?: string;
}

export interface DonorImpactData {
  stats: DonorImpactStats;
  history: DonorImpactHistory[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}