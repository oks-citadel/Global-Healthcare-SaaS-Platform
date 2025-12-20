import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API functions
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/admin/auth/login', { email, password }),
  logout: () => api.post('/admin/auth/logout'),
  getProfile: () => api.get('/admin/auth/me'),
}

export const dashboardApi = {
  getMetrics: () => api.get('/admin/dashboard/metrics'),
  getChartData: (period: string) => api.get(`/admin/dashboard/charts?period=${period}`),
}

export const usersApi = {
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  createUser: (data: any) => api.post('/admin/users', data),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  suspendUser: (id: string) => api.post(`/admin/users/${id}/suspend`),
  activateUser: (id: string) => api.post(`/admin/users/${id}/activate`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
}

export const providersApi = {
  getProviders: (params?: any) => api.get('/admin/providers', { params }),
  getProvider: (id: string) => api.get(`/admin/providers/${id}`),
  verifyProvider: (id: string, data: any) => api.post(`/admin/providers/${id}/verify`, data),
  approveProvider: (id: string) => api.post(`/admin/providers/${id}/approve`),
  rejectProvider: (id: string, reason: string) =>
    api.post(`/admin/providers/${id}/reject`, { reason }),
}

export const appointmentsApi = {
  getAppointments: (params?: any) => api.get('/admin/appointments', { params }),
  getAppointment: (id: string) => api.get(`/admin/appointments/${id}`),
  cancelAppointment: (id: string, reason: string) =>
    api.post(`/admin/appointments/${id}/cancel`, { reason }),
}

export const billingApi = {
  getSubscriptions: (params?: any) => api.get('/admin/billing/subscriptions', { params }),
  getInvoices: (params?: any) => api.get('/admin/billing/invoices', { params }),
  getRevenue: (period: string) => api.get(`/admin/billing/revenue?period=${period}`),
}

export const auditApi = {
  getAuditLogs: (params?: any) => api.get('/admin/audit-logs', { params }),
}

export const settingsApi = {
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
}

export const reportsApi = {
  getUserStats: (params?: any) => api.get('/admin/reports/users', { params }),
  getProviderStats: (params?: any) => api.get('/admin/reports/providers', { params }),
  getRevenueReport: (params?: any) => api.get('/admin/reports/revenue', { params }),
  getAppointmentStats: (params?: any) => api.get('/admin/reports/appointments', { params }),
}
