// API Service for backend communication
const API_URL = import.meta.env.VITE_API_URL || '';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    };

    // Add token to Authorization header if available
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async register(email, username, password) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
    
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  async logout() {
    await this.request('/api/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getCurrentUser() {
    return await this.request('/api/auth/me');
  }

  // State Management
  async saveState(stateData) {
    return await this.request('/api/states', {
      method: 'POST',
      body: JSON.stringify(stateData),
    });
  }

  async getStates() {
    return await this.request('/api/states');
  }

  async getState(id) {
    return await this.request(`/api/states/${id}`);
  }

  async updateState(id, stateData) {
    return await this.request(`/api/states/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stateData),
    });
  }

  async deleteState(id) {
    return await this.request(`/api/states/${id}`, {
      method: 'DELETE',
    });
  }

  async getLatestState() {
    return await this.request('/api/states/user/latest');
  }

  // Alpha Beta Scores
  async saveAlphaBetaScore(scoreData) {
    return await this.request('/api/alphabeta/scores', {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  }

  async getAlphaBetaScores() {
    return await this.request('/api/alphabeta/scores');
  }

  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default new ApiService();
