import { ApiService } from '~/services/api'
import type {
  CheckDorRequest,
  CheckDorResponse,
  CreateChecklistRequest,
  UpdateChecklistRequest,
  UpdatePromptRequest,
  Checklist
} from '~/types/api'

export const useApi = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const handleApiCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    loading.value = true
    error.value = null
    
    try {
      const result = await apiCall()
      return result
    } catch (err: any) {
      console.error('API Error:', err)
      error.value = err.response?.data?.message || err.message || 'Произошла ошибка'
      return null
    } finally {
      loading.value = false
    }
  }

  const checkDor = async (data: CheckDorRequest): Promise<CheckDorResponse | null> => {
    return handleApiCall(() => ApiService.checkDor(data))
  }

  const getChecklists = async () => {
    return handleApiCall(() => ApiService.getChecklists())
  }

  const createChecklist = async (data: CreateChecklistRequest): Promise<Checklist | null> => {
    return handleApiCall(() => ApiService.createChecklist(data))
  }

  const updateChecklist = async (id: number, data: UpdateChecklistRequest): Promise<Checklist | null> => {
    return handleApiCall(() => ApiService.updateChecklist(id, data))
  }

  const deleteChecklist = async (id: number) => {
    return handleApiCall(() => ApiService.deleteChecklist(id))
  }

  const getPrompt = async () => {
    return handleApiCall(() => ApiService.getPrompt())
  }

  const updatePrompt = async (data: UpdatePromptRequest) => {
    return handleApiCall(() => ApiService.updatePrompt(data))
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    checkDor,
    getChecklists,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    getPrompt,
    updatePrompt,
  }
} 