## ТЗ Backend - Сервис проверки задач на DoR

### Описание проекта
REST API для проверки задач на соответствие Definition of Ready (DoR) с использованием OpenAI GPT-o4 mini.

### Технологический стек
- Python 3.10+
- FastAPI
- OpenAI API
- Pydantic для валидации
- JSON файлы для хранения данных (без БД)

### Структура проекта
```
backend/
├── main.py
├── models/
│   ├── __init__.py
│   └── schemas.py
├── services/
│   ├── __init__.py
│   ├── openai_service.py
│   └── storage_service.py
├── api/
│   ├── __init__.py
│   └── routes.py
├── data/
│   ├── checklists.json
│   └── prompt.json
└── requirements.txt
```

### API Endpoints

#### 1. Проверка задачи на DoR
```
POST /api/check-dor
Request Body:
{
  "task_text": string (required),
  "meta_info": string (optional),
  "checklist_id": integer (required)
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

#### 2. Получить все чек-листы
```
GET /api/checklists
Response:
{
  "checklists": [
    {
      "id": integer,
      "name": string,
      "items": string[]
    }
  ]
}
```

#### 3. Создать чек-лист
```
POST /api/checklists
Request Body:
{
  "name": string,
  "items": string[]
}

Response:
{
  "id": integer,
  "name": string,
  "items": string[]
}
```

#### 4. Обновить чек-лист
```
PUT /api/checklists/{checklist_id}
Request Body:
{
  "name": string,
  "items": string[]
}

Response:
{
  "id": integer,
  "name": string,
  "items": string[]
}
```

#### 5. Удалить чек-лист
```
DELETE /api/checklists/{checklist_id}
Response:
{
  "status": "success"
}
```

#### 6. Получить текущий промпт
```
GET /api/prompt
Response:
{
  "prompt": string
}
```

#### 7. Обновить промпт
```
PUT /api/prompt
Request Body:
{
  "prompt": string
}

Response:
{
  "status": "success"
}
```

### Требования к реализации

#### 1. OpenAI Service
- Использовать модель gpt-4o-mini
- Формировать системный промпт из сохраненного шаблона
- В промпт включать:
  - Текст задачи
  - Метаинформацию (если есть)
  - Пункты выбранного чек-листа
- Парсить ответ ИИ в структурированный формат

#### 2. Storage Service
- Хранение чек-листов в `data/checklists.json`
- Хранение промпта в `data/prompt.json`
- Автоинкремент ID для чек-листов
- Валидация существования чек-листа при операциях

#### 3. Дефолтные данные
**Промпт по умолчанию:**
```
Ты эксперт по оценке готовности задач к разработке. Проанализируй предоставленную задачу на соответствие чек-листу Definition of Ready.

Для каждого пункта чек-листа определи:
- passed: пункт полностью выполнен
- failed: пункт не выполнен
- unclear: недостаточно информации для оценки

Дай конкретные рекомендации по улучшению задачи.
```

**Дефолтный чек-лист:**
```json
{
  "id": 1,
  "name": "Стандартный DoR",
  "items": [
    "Цель задачи ясно сформулирована",
    "Критерии приемки определены",
    "Есть описание пользовательского сценария",
    "Указаны зависимости и блокеры",
    "Оценка трудозатрат проведена"
  ]
}
```

#### 4. Обработка ошибок
- Валидация входных данных через Pydantic
- Обработка ошибок OpenAI API
- Корректные HTTP статус коды
- Информативные сообщения об ошибках

#### 5. Конфигурация
- OpenAI API ключ через переменную окружения `OPENAI_API_KEY`
- CORS настройки для работы с фронтендом

