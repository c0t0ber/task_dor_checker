export interface ChecklistItem {
  item: string
  status: 'passed' | 'failed' | 'unclear'
  comment: string
}

export interface CheckDorRequest {
  task_text: string
  meta_info?: string
  checklist_id: number
}

export interface CheckDorResponse {
  status: 'success' | 'error'
  recommendations: string
  checklist_results: ChecklistItem[]
}

export interface Checklist {
  id: number
  name: string
  items: string[]
}

export interface ChecklistsResponse {
  checklists: Checklist[]
}

export interface CreateChecklistRequest {
  name: string
  items: string[]
}

export interface UpdateChecklistRequest {
  name: string
  items: string[]
}

export interface PromptResponse {
  prompt: string
}

export interface UpdatePromptRequest {
  prompt: string
}

export interface ApiResponse {
  status: 'success' | 'error'
  message?: string
} 