const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;
  private userId: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  getUserId(): string | null {
    return this.userId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.userId) {
      headers['x-user-id'] = this.userId;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'Unknown error', data.code);
    }

    return data;
  }

  async createAnonymousUser(): Promise<{ id: string; anonymousId: string; ticketBalance: number }> {
    return this.request('/auth/anonymous', { method: 'POST' });
  }

  async getMe(): Promise<{ id: string; email?: string; createdAt: string; ticketBalance: number }> {
    return this.request('/me');
  }

  async getTicketBalance(): Promise<{ balance: number; recentTransactions: any[] }> {
    return this.request('/tickets/balance');
  }

  async purchaseTickets(productId?: string, quantity?: number): Promise<{ success: boolean; ticketsAdded: number; newBalance: number }> {
    return this.request('/tickets/purchase', { method: 'POST', body: JSON.stringify({ productId, quantity }) });
  }

  async generateWorkout(params: any): Promise<any> {
    return this.request('/generate', { method: 'POST', body: JSON.stringify(params) });
  }

  async getWorkouts(options?: { type?: string; limit?: number; offset?: number }): Promise<any> {
    const params = new URLSearchParams();
    if (options?.type) params.append('type', options.type);
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.offset) params.append('offset', String(options.offset));
    return this.request(`/workouts?${params.toString()}`);
  }

  async getWorkout(id: string): Promise<any> {
    return this.request(`/workouts/${id}`);
  }

  async deleteWorkout(id: string): Promise<{ success: boolean }> {
    return this.request(`/workouts/${id}`, { method: 'DELETE' });
  }

  async saveTemplate(templateId: string, title: string, content: any): Promise<any> {
    return this.request('/workouts/save-template', { method: 'POST', body: JSON.stringify({ templateId, title, content }) });
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();

