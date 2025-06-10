import axios from 'axios'
import type {
  CheckDorRequest,
  CheckDorResponse,
  ChecklistsResponse,
  CreateChecklistRequest,
  UpdateChecklistRequest,
  PromptResponse,
  UpdatePromptRequest,
  ApiResponse,
  Checklist
} from '~/types/api'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export class ApiService {
  static async checkDor(data: CheckDorRequest): Promise<CheckDorResponse> {
    const response = await api.post<CheckDorResponse>('/check-dor', data)
    return response.data
  }

  static async getChecklists(): Promise<ChecklistsResponse> {
    const response = await api.get<ChecklistsResponse>('/checklists')
    return response.data
  }

  static async createChecklist(data: CreateChecklistRequest): Promise<Checklist> {
    const response = await api.post<Checklist>('/checklists', data)
    return response.data
  }

  static async updateChecklist(id: number, data: UpdateChecklistRequest): Promise<Checklist> {
    const response = await api.put<Checklist>(`/checklists/${id}`, data)
    return response.data
  }

  static async deleteChecklist(id: number): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/checklists/${id}`)
    return response.data
  }

  static async getPrompt(): Promise<PromptResponse> {
    const response = await api.get<PromptResponse>('/prompt')
    return response.data
  }

  static async updatePrompt(data: UpdatePromptRequest): Promise<ApiResponse> {
    const response = await api.put<ApiResponse>('/prompt', data)
    return response.data
  }
} 