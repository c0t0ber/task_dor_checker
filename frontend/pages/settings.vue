<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-lg shadow-purple-500/25">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
      <h1 class="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-4">
        Настройки
      </h1>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        Управление промптом ИИ и чек-листами DoR
      </p>
    </div>

    <!-- Tabs -->
    <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      <div class="border-b border-slate-200/50">
        <nav class="flex">
          <button
            @click="activeTab = 'prompt'"
            class="flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-3"
            :class="activeTab === 'prompt' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <span>Промпт ИИ</span>
          </button>
          <button
            @click="activeTab = 'checklists'"
            class="flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-3"
            :class="activeTab === 'checklists' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            <span>Чек-листы</span>
          </button>
        </nav>
      </div>

      <!-- Prompt Tab -->
      <div v-if="activeTab === 'prompt'" class="p-8">
        <div class="space-y-6">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-slate-800">Управление промптом</h2>
          </div>
          
          <div class="space-y-6">
            <div>
              <label for="prompt-textarea" class="flex items-center text-sm font-semibold text-slate-700 mb-3">
                <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Промпт для ИИ
              </label>
              <textarea
                id="prompt-textarea"
                v-model="promptText"
                rows="10"
                class="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white/80 backdrop-blur-sm font-mono text-sm"
                placeholder="Введите промпт для ИИ..."
              />
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                @click="resetPrompt"
                type="button"
                class="px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>Сбросить к дефолтному</span>
              </button>
              
              <button
                @click="savePrompt"
                :disabled="!promptChanged || loading"
                type="button"
                class="px-4 py-2 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ loading ? 'Сохраняем...' : 'Сохранить' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Checklists Tab -->
      <div v-if="activeTab === 'checklists'" class="p-8 space-y-8">
        <!-- Existing Checklists -->
        <div class="space-y-6">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-slate-800">Существующие чек-листы</h2>
          </div>
          
          <div class="space-y-6">
            <div 
              v-for="checklist in appStore.checklists" 
              :key="checklist.id"
              class="bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
            >
              <div v-if="editingChecklistId !== checklist.id">
                <!-- View Mode -->
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-xl font-bold text-slate-900">{{ checklist.name }}</h3>
                  <div class="flex space-x-3">
                    <button
                      @click="startEditingChecklist(checklist)"
                      class="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      <span>Редактировать</span>
                    </button>
                    <button
                      @click="confirmDeleteChecklist(checklist.id)"
                      class="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      :disabled="appStore.checklists.length <= 1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      <span>Удалить</span>
                    </button>
                  </div>
                </div>
                <div class="grid gap-3">
                  <div v-for="item in checklist.items" :key="item" class="flex items-start bg-slate-50/50 rounded-lg p-3">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span class="text-slate-700">{{ item }}</span>
                  </div>
                </div>
              </div>

              <div v-else>
                <!-- Edit Mode -->
                <div class="space-y-6">
                  <div>
                    <label class="flex items-center text-sm font-semibold text-slate-700 mb-3">
                      <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                      Название
                    </label>
                    <input
                      v-model="editingChecklist.name"
                      type="text"
                      class="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  
                  <div>
                    <label class="flex items-center text-sm font-semibold text-slate-700 mb-4">
                      <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                      </svg>
                      Пункты чек-листа
                    </label>
                    <div class="space-y-3">
                      <div 
                        v-for="(item, index) in editingChecklist.items" 
                        :key="index"
                        class="flex items-center space-x-3"
                      >
                        <input
                          v-model="editingChecklist.items[index]"
                          type="text"
                          class="flex-1 rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                        <button
                          @click="removeChecklistItem(index)"
                          type="button"
                          class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          :disabled="editingChecklist.items.length <= 1"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <button
                      @click="addChecklistItem"
                      type="button"
                      class="mt-4 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      <span>Добавить пункт</span>
                    </button>
                  </div>
                  
                  <div class="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                    <button
                      @click="cancelEditingChecklist"
                      type="button"
                      class="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                      <span>Отмена</span>
                    </button>
                    <button
                      @click="saveEditingChecklist"
                      :disabled="loading"
                      type="button"
                      class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>{{ loading ? 'Сохраняем...' : 'Сохранить' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create New Checklist -->
        <div class="bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-300 rounded-2xl p-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-slate-800">Создать новый чек-лист</h2>
          </div>
          
          <div class="space-y-6">
            <div>
              <label class="flex items-center text-sm font-semibold text-slate-700 mb-3">
                <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                Название
              </label>
              <input
                v-model="newChecklist.name"
                type="text"
                class="w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                placeholder="Название чек-листа"
              />
            </div>
            
            <div>
              <label class="flex items-center text-sm font-semibold text-slate-700 mb-4">
                <svg class="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                Пункты чек-листа
              </label>
              <div class="space-y-3">
                <div 
                  v-for="(item, index) in newChecklist.items" 
                  :key="index"
                  class="flex items-center space-x-3"
                >
                  <input
                    v-model="newChecklist.items[index]"
                    type="text"
                    class="flex-1 rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    placeholder="Пункт чек-листа"
                  />
                  <button
                    @click="removeNewChecklistItem(index)"
                    type="button"
                    class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    :disabled="newChecklist.items.length <= 1"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <button
                @click="addNewChecklistItem"
                type="button"
                class="mt-4 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>Добавить пункт</span>
              </button>
            </div>
            
            <div class="flex justify-end">
              <button
                @click="createChecklist"
                :disabled="!canCreateChecklist || loading"
                type="button"
                class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex items-center space-x-2"
              >
                <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>{{ loading ? 'Создаем...' : 'Создать чек-лист' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl p-6 shadow-lg">
      <div class="flex">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-semibold text-green-800">Успешно</h3>
          <div class="mt-1 text-green-700">{{ successMessage }}</div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
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
          <div class="mt-1 text-red-700">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { useApi } from '~/composables/useApi'
import type { Checklist } from '~/types/api'

const appStore = useAppStore()
const { loading, error, createChecklist: apiCreateChecklist, updateChecklist: apiUpdateChecklist, deleteChecklist: apiDeleteChecklist, updatePrompt: apiUpdatePrompt, getChecklists, getPrompt } = useApi()

// Tabs
const activeTab = ref<'prompt' | 'checklists'>('prompt')

// Prompt management
const promptText = ref('')
const successMessage = ref('')

// Checklist management
const editingChecklistId = ref<number | null>(null)
const editingChecklist = ref<Omit<Checklist, 'id'>>({ name: '', items: [] })
const newChecklist = ref({ name: '', items: [''] })

// Load data on mount
onMounted(async () => {
  appStore.loadFromStorage()
  promptText.value = appStore.currentPrompt
  
  // Загружаем данные из API
  const checklistsData = await getChecklists()
  if (checklistsData) {
    // Обновляем store данными из API
    appStore.syncChecklists(checklistsData.checklists)
  }
  
  const promptData = await getPrompt()
  if (promptData) {
    appStore.updatePrompt(promptData.prompt)
    promptText.value = promptData.prompt
  }
})

// Computed properties
const promptChanged = computed(() => {
  return promptText.value !== appStore.currentPrompt
})

const canCreateChecklist = computed(() => {
  return newChecklist.value.name.trim() && 
         newChecklist.value.items.some(item => item.trim())
})

// Prompt methods
const savePrompt = async () => {
  const result = await apiUpdatePrompt({ prompt: promptText.value })
  if (result) {
    appStore.updatePrompt(promptText.value)
    showSuccessMessage('Промпт сохранен')
  } else if (error.value) {
    showErrorMessage(error.value)
  }
}

const resetPrompt = () => {
  appStore.resetPromptToDefault()
  promptText.value = appStore.currentPrompt
  showSuccessMessage('Промпт сброшен к дефолтному значению')
}

// Checklist methods
const startEditingChecklist = (checklist: Checklist) => {
  editingChecklistId.value = checklist.id
  editingChecklist.value = {
    name: checklist.name,
    items: [...checklist.items]
  }
}

const cancelEditingChecklist = () => {
  editingChecklistId.value = null
  editingChecklist.value = { name: '', items: [] }
}

const saveEditingChecklist = async () => {
  if (editingChecklistId.value && editingChecklist.value.name.trim()) {
    const filteredItems = editingChecklist.value.items.filter(item => item.trim())
    if (filteredItems.length > 0) {
      const result = await apiUpdateChecklist(editingChecklistId.value, {
        name: editingChecklist.value.name,
        items: filteredItems
      })
      
      if (result) {
        appStore.updateChecklist(editingChecklistId.value, {
          name: editingChecklist.value.name,
          items: filteredItems
        })
        editingChecklistId.value = null
        editingChecklist.value = { name: '', items: [] }
        showSuccessMessage('Чек-лист обновлен')
      } else if (error.value) {
        showErrorMessage(error.value)
      }
    }
  }
}

const confirmDeleteChecklist = async (id: number) => {
  if (appStore.checklists.length <= 1) {
    alert('Нельзя удалить последний чек-лист')
    return
  }
  
  if (confirm('Вы уверены, что хотите удалить этот чек-лист?')) {
    const result = await apiDeleteChecklist(id)
    if (result) {
      appStore.removeChecklist(id)
      showSuccessMessage('Чек-лист удален')
    } else if (error.value) {
      showErrorMessage(error.value)
    }
  }
}

const addChecklistItem = () => {
  editingChecklist.value.items.push('')
}

const removeChecklistItem = (index: number) => {
  if (editingChecklist.value.items.length > 1) {
    editingChecklist.value.items.splice(index, 1)
  }
}

const addNewChecklistItem = () => {
  newChecklist.value.items.push('')
}

const removeNewChecklistItem = (index: number) => {
  if (newChecklist.value.items.length > 1) {
    newChecklist.value.items.splice(index, 1)
  }
}

const createChecklist = async () => {
  if (canCreateChecklist.value) {
    const filteredItems = newChecklist.value.items.filter(item => item.trim())
    
    const result = await apiCreateChecklist({
      name: newChecklist.value.name,
      items: filteredItems
    })
    
    if (result) {
      appStore.addChecklist(result)
      newChecklist.value = { name: '', items: [''] }
      showSuccessMessage('Чек-лист создан')
    } else if (error.value) {
      showErrorMessage(error.value)
    }
  }
}

// Utility methods
const showSuccessMessage = (message: string) => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const showErrorMessage = (message: string) => {
  // Ошибка отображается через error из useApi
}
</script> 