const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('agri_setu_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(identifier: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Farmer
  async getDashboard() {
    const res = await fetch(`${API_BASE}/farmers/dashboard`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getFarmerProfile() {
    const res = await fetch(`${API_BASE}/farmers/profile`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updateFarmerProfile(data: any) {
    const res = await fetch(`${API_BASE}/farmers/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Crops
  async analyzeCrop(image: string, cropNameHint?: string) {
    const res = await fetch(`${API_BASE}/crops/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ image, cropNameHint }),
    });
    return res.json();
  },

  async getCropHistory() {
    const res = await fetch(`${API_BASE}/crops/history`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getCropGuidance(crop: string, season?: string, location?: string) {
    const params = new URLSearchParams({ crop, season: season || 'Kharif', location: location || 'Central India' });
    const res = await fetch(`${API_BASE}/crops/guidance?${params.toString()}`);
    return res.json();
  },

  async getCrops() {
    const res = await fetch(`${API_BASE}/crops`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async addCrop(cropData: any) {
    const res = await fetch(`${API_BASE}/crops`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cropData),
    });
    return res.json();
  },

  async deleteCrop(id: string) {
    const res = await fetch(`${API_BASE}/crops/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Schemes
  async getSchemes(params?: { category?: string; search?: string; state?: string }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.state) query.set('state', params.state);

    const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
    return res.json();
  },

  async getSchemeAdvisory(params?: { state?: string; landSize?: number }) {
    const query = new URLSearchParams();
    if (params?.state) query.set('state', params.state);
    if (params?.landSize) query.set('landSize', String(params.landSize));
    const res = await fetch(`${API_BASE}/schemes/advisory?${query.toString()}`);
    return res.json();
  },

  async getSchemeById(id: string) {
    const res = await fetch(`${API_BASE}/schemes/${id}`);
    return res.json();
  },

  async checkEligibility(data: any) {
    const res = await fetch(`${API_BASE}/schemes/check-eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async saveScheme(schemeId: string) {
    const res = await fetch(`${API_BASE}/schemes/save`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ schemeId }),
    });
    return res.json();
  },

  async unsaveScheme(schemeId: string) {
    const res = await fetch(`${API_BASE}/schemes/save/${schemeId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getSavedSchemes() {
    const res = await fetch(`${API_BASE}/schemes/saved`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Weather
  async getWeather(district?: string) {
    const query = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`${API_BASE}/weather/current${query}`);
    return res.json();
  },

  async getWeatherAlerts() {
    const res = await fetch(`${API_BASE}/weather/alerts`);
    return res.json();
  },

  // Mandi
  async getMandiPrices(params?: { crop?: string; state?: string; district?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.crop) query.set('crop', params.crop);
    if (params?.state) query.set('state', params.state);
    if (params?.district) query.set('district', params.district);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/mandi/prices?${query.toString()}`);
    return res.json();
  },

  async compareMandiPrices(crop: string) {
    const res = await fetch(`${API_BASE}/mandi/compare?crop=${encodeURIComponent(crop)}`);
    return res.json();
  },

  async getMandiHistory(crop: string) {
    const res = await fetch(`${API_BASE}/mandi/history?crop=${encodeURIComponent(crop)}`);
    return res.json();
  },

  // Insurance
  async getInsuranceSchemes() {
    const res = await fetch(`${API_BASE}/insurance/schemes`);
    return res.json();
  },

  async getInsuranceGuidance() {
    const res = await fetch(`${API_BASE}/insurance/guidance`);
    return res.json();
  },

  // Experts
  async getExperts(specialization?: string) {
    const query = specialization ? `?specialization=${encodeURIComponent(specialization)}` : '';
    const res = await fetch(`${API_BASE}/experts${query}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async submitExpertRequest(data: { cropName: string; question: string; expertId?: string; imageUrl?: string }) {
    const res = await fetch(`${API_BASE}/experts/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getExpertRequests() {
    const res = await fetch(`${API_BASE}/experts/requests`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async replyExpertRequest(id: string, reply: string) {
    const res = await fetch(`${API_BASE}/experts/requests/${id}/reply`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reply }),
    });
    return res.json();
  },

  // Chatbot
  async sendChatMessage(message: string, language: string = 'HI') {
    const res = await fetch(`${API_BASE}/chatbot/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, language }),
    });
    return res.json();
  },

  async getChatHistory() {
    const res = await fetch(`${API_BASE}/chatbot/history`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Admin
  async getAdminDashboard() {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminFarmers() {
    const res = await fetch(`${API_BASE}/admin/farmers`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async addAdminScheme(schemeData: any) {
    const res = await fetch(`${API_BASE}/admin/schemes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(schemeData),
    });
    return res.json();
  },

  async deleteAdminScheme(id: string) {
    const res = await fetch(`${API_BASE}/admin/schemes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Feedback
  async submitFeedback(rating: number, message: string) {
    const res = await fetch(`${API_BASE}/admin/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, message }),
    });
    return res.json();
  },

  async getFeedbacks() {
    const res = await fetch(`${API_BASE}/admin/feedback`);
    return res.json();
  },
};
