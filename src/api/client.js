const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.kld-dwims.tech'; // Update this to match backend ASP.NET URL

export function getToken() {
  return localStorage.getItem('dwims_token');
}

export function setToken(token) {
  localStorage.setItem('dwims_token', token);
}

export function getRefreshToken() {
  return localStorage.getItem('dwims_refresh_token');
}

export function setRefreshToken(token) {
  localStorage.setItem('dwims_refresh_token', token);
}

export function clearToken() {
  localStorage.removeItem('dwims_token');
  localStorage.removeItem('dwims_refresh_token');
}

export function isAuthenticated() {
  return !!getToken();
}

export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function getCurrentUserHighestRole() {
  const token = getToken();
  const payload = parseJwt(token);
  if (!payload || !payload['dwims:org_role']) return 0; // Submitter by default

  let roles = payload['dwims:org_role'];
  if (!Array.isArray(roles)) roles = [roles];

  const roleMap = {
    'Submitter': 0,
    'Reviewer': 1,
    'Administrator': 2,
    'SuperAdministrator': 3,
  };

  let highestRole = 0;
  for (const roleStr of roles) {
    const parts = roleStr.split(':');
    const roleValue = parts[parts.length - 1];

    let roleNum = roleMap[roleValue];
    if (roleNum === undefined) {
      roleNum = parseInt(roleValue, 10);
    }

    if (!isNaN(roleNum) && roleNum > highestRole) {
      highestRole = roleNum;
    }
  }
  return highestRole;
}

async function fetchWithAuth(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearToken();
    window.location.hash = '/login';
    throw new Error('Unauthorized');
  }

  return response;
}

export const api = {
  login: async (email, password) => {
    return await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (payload) => {
    return await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  loginWithGoogle: async (credential) => {
    return await fetch(`${BASE_URL}/auth/oauth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credential })
    });
  },

  forgotPassword: async (email) => {
    return await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  },

  resetPassword: async (userId, token, newPassword) => {
    return await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, token, newPassword })
    });
  },

  createSubmission: async (payload) => {
    const res = await fetchWithAuth('/submission', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to create submission: ${err}`);
    }
    return res;
  },

  getMySubmissions: async () => {
    const res = await fetchWithAuth('/submission/own');
    if (!res.ok) throw new Error('Failed to fetch submissions');
    return res.json();
  },

  getPendingReviews: async () => {
    const res = await fetchWithAuth('/submission/review');
    if (!res.ok) throw new Error('Failed to fetch pending reviews');
    return res.json();
  },

  getSubmission: async (id) => {
    const res = await fetchWithAuth(`/submission/${id}`);
    if (!res.ok) throw new Error('Failed to fetch submission details');
    return res.json();
  },

  getSubmissionToReview: async (id) => {
    const res = await fetchWithAuth(`/submission/review/${id}`);
    if (!res.ok) throw new Error('Failed to fetch submission details');
    return res.json();
  },

  respondToSubmission: async (submissionId, stepId, outcome, remarks) => {
    const res = await fetchWithAuth(`/submission/${submissionId}/steps/${stepId}`, {
      method: 'POST',
      body: JSON.stringify({ outcome, remarks: remarks || null })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.ErrorDescription || err.Error || 'Failed to respond to submission');
    }
    return res;
  },

  getProfile: async () => {
    const res = await fetchWithAuth('/users/me');
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  updateProfile: async (profileData) => {
    const res = await fetchWithAuth('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res;
  },

  uploadSignature: async (svgContent) => {
    const res = await fetchWithAuth('/users/me/signature', {
      method: 'PUT',
      body: JSON.stringify({ svgContent })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.ErrorDescription || err.Error || 'Failed to upload signature');
    }
    return res;
  },

  getProcesses: async () => {
    const res = await fetchWithAuth('/process');
    if (!res.ok) throw new Error('Failed to fetch processes');
    return res.json();
  },

  getProcess: async (id) => {
    const res = await fetchWithAuth(`/process/${id}`);
    if (!res.ok) throw new Error('Failed to fetch process');
    return res.json();
  },

  deleteProcess: async (id) => {
    const res = await fetchWithAuth(`/process/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete process');
  },

  getProcessSteps: async (processId) => {
    const res = await fetchWithAuth(`/process/${processId}/step`);
    if (!res.ok) throw new Error('Failed to fetch process steps');
    return res.json();
  },

  createProcess: async (title, departmentId) => {
    const res = await fetchWithAuth('/process', {
      method: 'POST',
      body: JSON.stringify({ title, departmentId })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to create process: ${errText || res.status}`);
    }
    return res.json();
  },

  addProcessStep: async (processId, payload) => {
    const res = await fetchWithAuth(`/process/${processId}/step?processId=${processId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to add step: ${err}`);
    }
    return res;
  },

  updateProcessStep: async (processId, stepId, payload) => {
    const res = await fetchWithAuth(`/process/${processId}/step/${stepId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.ErrorDescription || err.Error || 'Failed to update step');
    }
    return res;
  },

  addProcessField: async (processId, payload) => {
    const res = await fetchWithAuth(`/process/${processId}/field?processId=${processId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to add field: ${err}`);
    }
    return res;
  },

  getLogs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append('Page', filters.page);
    if (filters.pageSize) params.append('PageSize', filters.pageSize);
    if (filters.actionFilter) params.append('ActionFilter', filters.actionFilter);
    if (filters.userIdFilter) params.append('UserIdFilter', filters.userIdFilter);
    if (filters.from) params.append('From', filters.from);
    if (filters.to) params.append('To', filters.to);

    const res = await fetchWithAuth(`/logs?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  },

  getAnalyticsSummary: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.from) params.append('From', filters.from);
    if (filters.to) params.append('To', filters.to);
    if (filters.departmentId) params.append('DepartmentId', filters.departmentId);
    if (filters.processId) params.append('ProcessId', filters.processId);

    const res = await fetchWithAuth(`/analytics/summary?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch analytics summary');
    return res.json();
  },

  getDepartments: async () => {
    const res = await fetchWithAuth('/department');
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
  },

  createDepartment: async (name, description) => {
    const res = await fetchWithAuth('/department', {
      method: 'POST',
      body: JSON.stringify({ name, description: description || null })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.ErrorDescription || err.Error || 'Failed to create department');
    }
    return res;
  },

  updateDepartment: async (id, name, description) => {
    const res = await fetchWithAuth(`/department/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description: description || null })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.ErrorDescription || err.Error || 'Failed to update department');
    }
    return res;
  },

  deleteDepartment: async (id) => {
    const res = await fetchWithAuth(`/department/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.ErrorDescription || err.Error || 'Failed to delete department');
    }
    return res;
  },

  getDepartmentMembers: async (departmentId) => {
    const res = await fetchWithAuth(`/department/${departmentId}/members?departmentId=${departmentId}`);
    if (!res.ok) throw new Error('Failed to fetch department members');
    return res.json();
  },

  assignRole: async (email, departmentId, generalRole) => {
    const res = await fetchWithAuth('/roles', {
      method: 'POST',
      body: JSON.stringify({ email, departmentId, generalRole: parseInt(generalRole) })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.ErrorDescription || err.Error || 'Failed to assign role');
    }
    return res;
  },

  removeRole: async (roleId) => {
    const res = await fetchWithAuth(`/roles/${roleId}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.ErrorDescription || err.Error || `Failed to remove role (${res.status})`);
    }
    return res;
  },

  uploadDocument: async (processId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getToken();
    const res = await fetch(`${BASE_URL}/process/${processId}/document`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.ErrorDescription || err.Error || `Upload failed (${res.status})`);
    }
    return res.json();
  },

  getSubmissionDocument: async (submissionId) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/submission/${submissionId}/pdf`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) throw new Error('Document download failed');
    return res.blob();
  }
};
