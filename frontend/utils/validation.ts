export const validateTaskText = (text: string): string | null => {
  if (!text || !text.trim()) {
    return 'Текст задачи обязателен'
  }
  
  if (text.length < 10) {
    return 'Текст задачи должен содержать минимум 10 символов'
  }
  
  return null
}

export const validateChecklistId = (id: string | number): string | null => {
  if (!id) {
    return 'Выберите чек-лист'
  }
  
  return null
}

export const validateChecklistName = (name: string): string | null => {
  if (!name || !name.trim()) {
    return 'Название чек-листа обязательно'
  }
  
  if (name.length < 3) {
    return 'Название должно содержать минимум 3 символа'
  }
  
  return null
}

export const validateChecklistItems = (items: string[]): string | null => {
  const validItems = items.filter(item => item.trim())
  
  if (validItems.length === 0) {
    return 'Добавьте хотя бы один пункт'
  }
  
  return null
} 