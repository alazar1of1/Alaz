import {
  PortfolioData,
  PortfolioProfile,
  ProjectItem,
  ExperienceItem,
  SkillItem,
  CertificationItem,
  ContactMessage,
  DatabaseStatus,
} from '../types/portfolio.ts';

const API_BASE = '/api';

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const api = {
  // Public
  async getPortfolio(): Promise<PortfolioData> {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (!res.ok) throw new Error('Failed to fetch portfolio data');
    return res.json();
  },

  async getDatabaseStatus(): Promise<DatabaseStatus> {
    const res = await fetch(`${API_BASE}/db-status`);
    if (!res.ok) throw new Error('Failed to fetch database status');
    return res.json();
  },

  async submitContact(data: { name: string; email: string; subject: string; message: string }) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to send message');
    return json;
  },

  // Admin Auth
  async login(password: string, email?: string) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Authentication failed');
    return json;
  },

  async verifyToken(token: string) {
    const res = await fetch(`${API_BASE}/admin/verify`, {
      headers: authHeaders(token),
    });
    return res.ok;
  },

  // Admin Atlas Connection
  async connectAtlas(token: string, uri: string) {
    const res = await fetch(`${API_BASE}/admin/connect-atlas`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ uri }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to connect to Atlas');
    return json;
  },

  // Admin Messages
  async getMessages(token: string): Promise<ContactMessage[]> {
    const res = await fetch(`${API_BASE}/admin/messages`, {
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async markMessageRead(token: string, id: string, read: boolean): Promise<ContactMessage> {
    const res = await fetch(`${API_BASE}/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ read }),
    });
    if (!res.ok) throw new Error('Failed to update message');
    return res.json();
  },

  async deleteMessage(token: string, id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete message');
    const json = await res.json();
    return json.success;
  },

  // Admin Profile
  async updateProfile(token: string, data: Partial<PortfolioProfile>): Promise<PortfolioProfile> {
    const res = await fetch(`${API_BASE}/admin/profile`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Admin Projects
  async createProject(token: string, data: Omit<ProjectItem, '_id'>): Promise<ProjectItem> {
    const res = await fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(token: string, id: string, data: Partial<ProjectItem>): Promise<ProjectItem> {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async deleteProject(token: string, id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete project');
    const json = await res.json();
    return json.success;
  },

  // Admin Experiences
  async createExperience(token: string, data: Omit<ExperienceItem, '_id'>): Promise<ExperienceItem> {
    const res = await fetch(`${API_BASE}/admin/experiences`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create experience');
    return res.json();
  },

  async updateExperience(token: string, id: string, data: Partial<ExperienceItem>): Promise<ExperienceItem> {
    const res = await fetch(`${API_BASE}/admin/experiences/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update experience');
    return res.json();
  },

  async deleteExperience(token: string, id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/experiences/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete experience');
    const json = await res.json();
    return json.success;
  },

  // Admin Skills
  async createSkill(token: string, data: Omit<SkillItem, '_id'>): Promise<SkillItem> {
    const res = await fetch(`${API_BASE}/admin/skills`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create skill');
    return res.json();
  },

  async updateSkill(token: string, id: string, data: Partial<SkillItem>): Promise<SkillItem> {
    const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update skill');
    return res.json();
  },

  async deleteSkill(token: string, id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete skill');
    const json = await res.json();
    return json.success;
  },

  // Admin Certifications
  async createCertification(token: string, data: Omit<CertificationItem, '_id'>): Promise<CertificationItem> {
    const res = await fetch(`${API_BASE}/admin/certifications`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create certification');
    return res.json();
  },

  async updateCertification(token: string, id: string, data: Partial<CertificationItem>): Promise<CertificationItem> {
    const res = await fetch(`${API_BASE}/admin/certifications/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update certification');
    return res.json();
  },

  async deleteCertification(token: string, id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/certifications/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete certification');
    const json = await res.json();
    return json.success;
  },
};
