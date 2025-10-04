// services/api.ts
import { 
  Beneficiary, 
  Donation, 
  Project, 
  ImpactRecord, 
  DonationStats, 
  ImpactSummary,
  ApiResponse 
} from './types';

const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Beneficiary endpoints
  async createBeneficiary(beneficiaryData: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ApiResponse<Beneficiary>> {
    return this.fetchWithErrorHandling<Beneficiary>('/beneficiaries', {
      method: 'POST',
      body: JSON.stringify(beneficiaryData),
    });
  }

  async getBeneficiaries(): Promise<ApiResponse<Beneficiary[]>> {
    return this.fetchWithErrorHandling<Beneficiary[]>('/beneficiaries');
  }

  async updateBeneficiaryStatus(id: number, status: string): Promise<ApiResponse<void>> {
    return this.fetchWithErrorHandling<void>(`/beneficiaries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Donation endpoints
  async createDonation(donationData: Omit<Donation, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ApiResponse<Donation>> {
    return this.fetchWithErrorHandling<Donation>('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async getDonations(): Promise<ApiResponse<Donation[]>> {
    return this.fetchWithErrorHandling<Donation[]>('/donations');
  }

  async getDonationStats(): Promise<ApiResponse<DonationStats>> {
    return this.fetchWithErrorHandling<DonationStats>('/donations/stats');
  }

  // Project endpoints
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.fetchWithErrorHandling<Project[]>('/projects');
  }

  async getProjectProgress(): Promise<ApiResponse<Project[]>> {
    return this.fetchWithErrorHandling<Project[]>('/projects/progress');
  }

  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'collected_amount' | 'status'>): Promise<ApiResponse<Project>> {
    return this.fetchWithErrorHandling<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  // Impact endpoints
  async getImpactRecords(): Promise<ApiResponse<ImpactRecord[]>> {
    return this.fetchWithErrorHandling<ImpactRecord[]>('/impact');
  }

  async getImpactSummary(): Promise<ApiResponse<ImpactSummary>> {
    return this.fetchWithErrorHandling<ImpactSummary>('/impact/summary');
  }

  async createImpactRecord(impactData: Omit<ImpactRecord, 'id' | 'created_at'>): Promise<ApiResponse<ImpactRecord>> {
    return this.fetchWithErrorHandling<ImpactRecord>('/impact', {
      method: 'POST',
      body: JSON.stringify(impactData),
    });
  }
}

export const apiService = new ApiService();