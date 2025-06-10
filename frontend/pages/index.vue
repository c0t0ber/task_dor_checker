<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h1 class="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-4">
        Проверка задачи на DoR
      </h1>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        Проверьте задачу на соответствие Definition of Ready с помощью ИИ
      </p>
    </div>

    <!-- Main Form -->
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <form @submit.prevent="checkTask" class="space-y-8">
        <!-- Метаинформация -->
        <div class="space-y-3">
          <label for="meta-info" class="flex items-center text-sm font-semibold text-slate-700">
            <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Метаинформация
            <span class="ml-2 text-xs text-slate-500 font-normal">(опционально)</span>
          </label>
          <textarea
            id="meta-info"
            v-model="formData.metaInfo"
            rows="3"
            class="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            placeholder="Дополнительная информация о задаче, контекст проекта..."
          />
        </div>

        <!-- Текст задачи -->
        <div class="space-y-3">
          <label for="task-text" class="flex items-center text-sm font-semibold text-slate-700">
            <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Текст задачи
            <span class="ml-1 text-red-500">*</span>
          </label>
          <textarea
            id="task-text"
            v-model="formData.taskText"
            rows="6"
            required
            class="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            :class="{ 'border-red-400 ring-red-400': validationErrors.taskText }"
            placeholder="Опишите задачу подробно..."
          />
          <div v-if="validationErrors.taskText" class="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ validationErrors.taskText }}
          </div>
        </div>

        <!-- Выбор чек-листа -->
        <div class="space-y-3">
          <label for="checklist" class="flex items-center text-sm font-semibold text-slate-700">
            <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            Чек-лист DoR
            <span class="ml-1 text-red-500">*</span>
          </label>
          <select
            id="checklist"
            v-model="formData.checklistId"
            required
            class="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            :class="{ 'border-red-400 ring-red-400': validationErrors.checklistId }"
          >
            <option value="">Выберите чек-лист</option>
            <option 
              v-for="checklist in appStore.checklists" 
              :key="checklist.id" 
              :value="checklist.id"
            >
              {{ checklist.name }}
            </option>
          </select>
          <div v-if="validationErrors.checklistId" class="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ validationErrors.checklistId }}
          </div>
        </div>

        <!-- Кнопка проверки -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            {{ loading ? 'Анализируем задачу...' : 'Проверить задачу' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Ошибка -->
    <div v-if="error" class="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 shadow-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-red-800">Произошла ошибка</h3>
          <div class="mt-2 text-red-700">
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Результаты проверки -->
    <div v-if="checkResult" class="space-y-8 animate-fade-in">
      <!-- Общие рекомендации -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 mr-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Рекомендации ИИ</h2>
        </div>
        <div class="prose prose-slate max-w-none">
          <div class="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/50 rounded-xl p-6 border border-slate-200">{{ checkResult.recommendations }}</div>
        </div>
      </div>

      <!-- Результаты по чек-листу -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 mr-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Результаты проверки</h2>
        </div>
        <div class="space-y-4">
          <div 
            v-for="(item, index) in checkResult.checklist_results" 
            :key="index"
            class="border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg"
            :class="getStatusClass(item.status)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-semibold text-slate-900 text-lg mb-2">{{ item.item }}</h3>
                <p class="text-slate-600 leading-relaxed">{{ item.comment }}</p>
              </div>
              <span 
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ml-4 shadow-sm"
                :class="getStatusBadgeClass(item.status)"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="item.status === 'passed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  <path v-else-if="item.status === 'failed'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ getStatusText(item.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useApi } from '~/composables/useApi'
import type { ChecklistItem } from '~/types/api'

const appStore = useAppStore()
const { loading, error, checkDor } = useApi()

// Form data
const formData = reactive({
  metaInfo: '',
  taskText: '',
  checklistId: '' as string | number
})

// Validation
const validationErrors = reactive({
  taskText: '',
  checklistId: ''
})

// Results
const checkResult = computed(() => appStore.lastCheckResult)

// Load store data on mount
onMounted(() => {
  appStore.loadFromStorage()
})

// Form validation
const validateForm = (): boolean => {
  validationErrors.taskText = ''
  validationErrors.checklistId = ''
  
  let is_valid = true
  
  if (!formData.taskText.trim()) {
    validationErrors.taskText = 'Текст задачи обязателен'
    is_valid = false
  }
  
  if (!formData.checklistId) {
    validationErrors.checklistId = 'Выберите чек-лист'
    is_valid = false
  }
  
  return is_valid
}

// Submit form
const checkTask = async () => {
  if (!validateForm()) return
  
  const result = await checkDor({
    task_text: formData.taskText,
    meta_info: formData.metaInfo || undefined,
    checklist_id: Number(formData.checklistId)
  })
  
  if (result) {
    appStore.setLastCheckResult(result)
  }
}

// Status helpers
const getStatusClass = (status: ChecklistItem['status']) => {
  switch (status) {
    case 'passed':
      return 'border-emerald-300 bg-emerald-50/50'
    case 'failed':
      return 'border-red-300 bg-red-50/50'
    case 'unclear':
      return 'border-amber-300 bg-amber-50/50'
    default:
      return 'border-slate-200 bg-slate-50/50'
  }
}

const getStatusBadgeClass = (status: ChecklistItem['status']) => {
  switch (status) {
    case 'passed':
      return 'bg-emerald-100 text-emerald-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'unclear':
      return 'bg-amber-100 text-amber-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}

const getStatusText = (status: ChecklistItem['status']) => {
  switch (status) {
    case 'passed':
      return 'Пройден'
    case 'failed':
      return 'Не пройден'
    case 'unclear':
      return 'Неясно'
    default:
      return 'Неизвестно'
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>