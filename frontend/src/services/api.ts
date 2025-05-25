import axios from 'axios';
import {
  CheckTaskRequest,
  CheckTaskResponse,
  CreateDorRequest,
  CreateDorResponse,
  DeleteDorResponse,
  DorDetailResponse,
  DorListResponse,
  UpdateDorRequest,
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// DoR API endpoints
export const dorApi = {
  // Create DoR
  create: async (data: CreateDorRequest): Promise<CreateDorResponse> => {
    const response = await api.post('/dor/create', data);
    return response.data;
  },

  // Get all DoRs
  list: async (): Promise<DorListResponse[]> => {
    const response = await api.get('/dor/list');
    return response.data;
  },

  // Get DoR by ID
  getById: async (id: number): Promise<DorDetailResponse> => {
    const response = await api.get(`/dor/${id}`);
    return response.data;
  },

  // Update DoR
  update: async (id: number, data: UpdateDorRequest): Promise<CreateDorResponse> => {
    const response = await api.put(`/dor/${id}`, data);
    return response.data;
  },

  // Delete DoR
  delete: async (id: number): Promise<DeleteDorResponse> => {
    const response = await api.delete(`/dor/${id}`);
    return response.data;
  },
};

// Task checking API
export const taskApi = {
  check: async (data: CheckTaskRequest): Promise<CheckTaskResponse> => {
    const response = await api.post('/check', data);
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 