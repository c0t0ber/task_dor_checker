## ТЗ Frontend - Сервис проверки задач на DoR

### Описание проекта
Веб-приложение для проверки задач на соответствие Definition of Ready (DoR) с помощью ИИ. Пользователь вставляет текст задачи, выбирает чек-лист DoR, и получает рекомендации от ИИ.

### Технологический стек
- Vue 3 + Nuxt 3
- TypeScript
- Tailwind CSS

### Структура приложения

#### 1. Страница проверки задач (главная)
**Путь:** `/`

**Компоненты:**
- Поле ввода метаинформации (textarea, опционально)
- Поле ввода текста задачи (textarea, обязательно)
- Выпадающий список выбора чек-листа DoR
- Кнопка "Проверить"
- Блок отображения результатов проверки

**Функционал:**
- Валидация обязательных полей
- Отправка запроса на проверку
- Отображение результатов с рекомендациями
- Индикатор загрузки во время проверки

#### 2. Страница настроек
**Путь:** `/settings`

**Вкладки:**
1. **Управление промптом**
   - Поле редактирования промпта для ИИ (textarea)
   - Кнопка сохранения
   - Кнопка сброса к дефолтному значению

2. **Управление чек-листами DoR**
   - Список существующих чек-листов с возможностью:
     - Редактирования названия и пунктов
     - Удаления
   - Форма создания нового чек-листа:
     - Название чек-листа
     - Динамический список пунктов (добавление/удаление)
   - Кнопки сохранения изменений

### API Endpoints

#### 1. Проверка задачи
```
POST /api/check-dor
Request:
{
  "task_text": string,
  "meta_info": string (optional),
  "checklist_id": number
}
Response:
{
  "status": "success" | "error",
  "recommendations": string,
  "checklist_results": [
    {
      "item": string,
      "status": "passed" | "failed" | "unclear",
      "comment": string
    }
  ]
}
```

#### 2. Получение чек-листов
```
GET /api/checklists
Response:
{
  "checklists": [
    {
      "id": number,
      "name": string,
      "items": string[]
    }
  ]
}
```

#### 3. Создание чек-листа
```
POST /api/checklists
Request:
{
  "name": string,
  "items": string[]
}
Response:
{
  "id": number,
  "name": string,
  "items": string[]
}
```

#### 4. Обновление чек-листа
```
PUT /api/checklists/{id}
Request:
{
  "name": string,
  "items": string[]
}
Response:
{
  "id": number,
  "name": string,
  "items": string[]
}
```

#### 5. Удаление чек-листа
```
DELETE /api/checklists/{id}
Response:
{
  "status": "success"
}
```

#### 6. Получение промпта
```
GET /api/prompt
Response:
{
  "prompt": string
}
```

#### 7. Обновление промпта
```
PUT /api/prompt
Request:
{
  "prompt": string
}
Response:
{
  "status": "success"
}
```

### Требования к реализации
1. Использовать Composition API
2. Типизировать все данные через TypeScript
3. Обработка ошибок с понятными сообщениями пользователю
4. Адаптивная верстка
5. Сохранение настроек в localStorage для персистентности между сессиями
6. Дефолтный промпт и минимум один дефолтный чек-лист при первом запуске
