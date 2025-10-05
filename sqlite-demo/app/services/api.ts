// services/api.ts
import { 
  Beneficiary, 
  Donation, 
  Project, 
  ImpactRecord, 
  DonationStats, 
  ImpactSummary,
  BeneficiaryDashboardData,
  ApiResponse 
} from './types';

const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

// Auth types
export interface SignupData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
  token: string;
}

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

      // Parse response data
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }

      if (!response.ok) {
        // Extract error message from response
        const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
        console.error('API Error:', errorMessage);
        throw new Error(errorMessage);
      }

      return errorData as ApiResponse<T>;
    } catch (error: any) {
      console.error('API Error:', error);
      
      // Check for network errors
      if (error.message === 'Failed to fetch' || error.message === 'Network request failed') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      }
      
      // Re-throw the error so it can be caught by the calling code
      throw error;
    }
  }

  // Authentication endpoints
  async signup(signupData: SignupData): Promise<ApiResponse<AuthResponse>> {
    return this.fetchWithErrorHandling<AuthResponse>('/users/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  }

  async login(loginData: LoginData): Promise<ApiResponse<AuthResponse>> {
    return this.fetchWithErrorHandling<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }

  async getProfile(token: string): Promise<ApiResponse<{ user: any }>> {
    return this.fetchWithErrorHandling<{ user: any }>('/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
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

  async updateProject(id: number, projectData: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at' | 'collected_amount' | 'status'>>): Promise<ApiResponse<Project>> {
    return this.fetchWithErrorHandling<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: number): Promise<ApiResponse<void>> {
    return this.fetchWithErrorHandling<void>(`/projects/${id}`, {
      method: 'DELETE',
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

  // Beneficiary dashboard endpoint
  async getBeneficiaryDashboard(email: string): Promise<ApiResponse<BeneficiaryDashboardData>> {
    return this.fetchWithErrorHandling<BeneficiaryDashboardData>(`/beneficiaries/dashboard/${email}`);
  }
}

export const apiService = new ApiService();