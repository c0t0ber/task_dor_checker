import { defineStore } from 'pinia'
import type { Checklist, CheckDorResponse } from '~/types/api'

export const useAppStore = defineStore('app', () => {
  // State
  const checklists = ref<Checklist[]>([])
  const currentPrompt = ref<string>('')
  const lastCheckResult = ref<CheckDorResponse | null>(null)
  
  // Local storage keys
  const CHECKLISTS_KEY = 'dor_checker_checklists'
  const PROMPT_KEY = 'dor_checker_prompt'
  
  // Default data
  const defaultPrompt = 'Проанализируй задачу на соответствие Definition of Ready (DoR). Для каждого пункта чек-листа укажи статус: passed (выполнен), failed (не выполнен) или unclear (неясно). Дай рекомендации по улучшению.'
  
  const defaultChecklist: Checklist = {
    id: 1,
    name: 'Стандартный DoR',
    items: [
      'Задача четко сформулирована',
      'Определены критерии приемки',
      'Задача декомпозирована до нужного уровня',
      'Оценка сложности задачи проставлена',
      'Определены зависимости',
      'Техническое решение проработано',
      'Дизайн готов (если требуется)',
      'Тестовые сценарии определены'
    ]
  }

  // Actions
  const loadFromStorage = () => {
    if (process.client) {
      // Load checklists
      const storedChecklists = localStorage.getItem(CHECKLISTS_KEY)
      if (storedChecklists) {
        checklists.value = JSON.parse(storedChecklists)
      } else {
        checklists.value = [defaultChecklist]
        saveChecklistsToStorage()
      }
      
      // Load prompt
      const storedPrompt = localStorage.getItem(PROMPT_KEY)
      if (storedPrompt) {
        currentPrompt.value = storedPrompt
      } else {
        currentPrompt.value = defaultPrompt
        savePromptToStorage()
      }
    }
  }

  const saveChecklistsToStorage = () => {
    if (process.client) {
      localStorage.setItem(CHECKLISTS_KEY, JSON.stringify(checklists.value))
    }
  }

  const savePromptToStorage = () => {
    if (process.client) {
      localStorage.setItem(PROMPT_KEY, currentPrompt.value)
    }
  }

  const addChecklist = (checklist: Checklist) => {
    checklists.value.push(checklist)
    saveChecklistsToStorage()
  }

  const updateChecklist = (id: number, updatedChecklist: Omit<Checklist, 'id'>) => {
    const index = checklists.value.findIndex(c => c.id === id)
    if (index !== -1) {
      checklists.value[index] = { ...updatedChecklist, id }
      saveChecklistsToStorage()
    }
  }

  const removeChecklist = (id: number) => {
    const index = checklists.value.findIndex(c => c.id === id)
    if (index !== -1) {
      checklists.value.splice(index, 1)
      saveChecklistsToStorage()
    }
  }

  const updatePrompt = (newPrompt: string) => {
    currentPrompt.value = newPrompt
    savePromptToStorage()
  }

  const resetPromptToDefault = () => {
    currentPrompt.value = defaultPrompt
    savePromptToStorage()
  }

  const setLastCheckResult = (result: CheckDorResponse) => {
    lastCheckResult.value = result
  }

  const getNextChecklistId = (): number => {
    return Math.max(...checklists.value.map(c => c.id), 0) + 1
  }

  // Getters
  const getChecklistById = (id: number): Checklist | undefined => {
    return checklists.value.find(c => c.id === id)
  }

  const syncChecklists = (newChecklists: Checklist[]) => {
    checklists.value = newChecklists
    saveChecklistsToStorage()
  }

  return {
    // State
    checklists: readonly(checklists),
    currentPrompt: readonly(currentPrompt),
    lastCheckResult: readonly(lastCheckResult),
    
    // Actions
    loadFromStorage,
    addChecklist,
    updateChecklist,
    removeChecklist,
    updatePrompt,
    resetPromptToDefault,
    setLastCheckResult,
    getNextChecklistId,
    getChecklistById,
    syncChecklists,
  }
}) 