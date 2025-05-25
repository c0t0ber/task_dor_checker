# Техническое задание: DoR Checker

## 1. Описание проекта

Веб-приложение для проверки текста задач на соответствие критериям Definition of Ready (DoR).

## 2. Основной функционал

### 2.1 Управление DoR-шаблонами
- Создание новых DoR с набором критериев
- Редактирование существующих DoR
- Удаление DoR
- Сохранение в SQLite базе данных
- Просмотр списка всех DoR

### 2.2 Проверка задачи
- Форма для вставки текста задачи
- Выбор DoR из списка сохраненных
- AI анализирует текст и проверяет каждый критерий
- Вывод результатов: выполнен/не выполнен + комментарий

## 3. Архитектура

### 3.1 Backend (Python)
```
# DoR управление
POST   /api/dor/create     - создание нового DoR
GET    /api/dor/list       - список всех DoR
GET    /api/dor/{id}       - получить конкретный DoR
PUT    /api/dor/{id}       - обновить DoR
DELETE /api/dor/{id}       - удалить DoR

# Проверка
POST   /api/check          - проверка задачи на соответствие DoR
```

### 3.2 База данных (SQLite)
```sql
-- Инициализация базы данных
CREATE TABLE IF NOT EXISTS dor_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dor_criteria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dor_id INTEGER NOT NULL,
    criterion TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY (dor_id) REFERENCES dor_templates(id) ON DELETE CASCADE
);

-- Индекс для быстрой выборки критериев
CREATE INDEX idx_dor_criteria ON dor_criteria(dor_id);
```

## 4. API Endpoints детально

### 4.1 POST /api/dor/create
Request:
```json
{
  "name": "Backend Task DoR",
  "description": "Стандартный DoR для backend задач",
  "criteria": [
    "Задача содержит четкое описание проблемы или функционала",
    "Указаны acceptance criteria (критерии приемки)",
    "Есть оценка времени выполнения",
    "Описаны API endpoints (если применимо)",
    "Указаны зависимости от других задач или сервисов"
  ]
}
```

Response:
```json
{
  "id": 1,
  "message": "DoR успешно создан"
}
```

### 4.2 GET /api/dor/list
Response:
```json
[
  {
    "id": 1,
    "name": "Backend Task DoR",
    "description": "Стандартный DoR для backend задач",
    "criteria_count": 5,
    "created_at": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "name": "Bug Fix DoR",
    "description": "DoR для багов",
    "criteria_count": 4,
    "created_at": "2024-01-15T11:00:00"
  }
]
```

### 4.3 GET /api/dor/{id}
Response:
```json
{
  "id": 1,
  "name": "Backend Task DoR",
  "description": "Стандартный DoR для backend задач",
  "criteria": [
    {
      "id": 1,
      "criterion": "Задача содержит четкое описание проблемы или функционала",
      "order_index": 0
    },
    {
      "id": 2,
      "criterion": "Указаны acceptance criteria (критерии приемки)",
      "order_index": 1
    }
  ]
}
```

### 4.4 PUT /api/dor/{id}
Request:
```json
{
  "name": "Updated Backend DoR",
  "description": "Обновленное описание",
  "criteria": [
    "Новый критерий 1",
    "Новый критерий 2"
  ]
}
```

### 4.5 DELETE /api/dor/{id}
Response:
```json
{
  "message": "DoR успешно удален"
}
```

### 4.6 POST /api/check
Request:
```json
{
  "dor_id": 1,
  "task_text": "Необходимо создать API endpoint для генерации отчетов. Endpoint должен принимать параметры даты начала и конца периода."
}
```

Response:
```json
{
  "dor_name": "Backend Task DoR",
  "total_criteria": 5,
  "passed_criteria": 2,
  "pass_rate": 40,
  "results": [
    {
      "criterion": "Задача содержит четкое описание проблемы или функционала",
      "passed": true,
      "comment": "Описание присутствует, указана цель создания endpoint"
    },
    {
      "criterion": "Указаны acceptance criteria (критерии приемки)",
      "passed": false,
      "comment": "Добавьте критерии приемки: что должен возвращать endpoint, формат данных, обработка ошибок"
    },
    {
      "criterion": "Есть оценка времени выполнения",
      "passed": false,
      "comment": "Укажите примерную оценку в часах или днях"
    },
    {
      "criterion": "Описаны API endpoints (если применимо)",
      "passed": true,
      "comment": "Базовое описание endpoint присутствует"
    },
    {
      "criterion": "Указаны зависимости от других задач или сервисов",
      "passed": false,
      "comment": "Укажите, от каких сервисов или баз данных зависит этот endpoint"
    }
  ]
}
```

## 5. Требования к реализации

### 5.1 Backend (Python)
- **Framework**: FastAPI
- **База данных**: SQLite (файл `dor_checker.db`)
- **AI**: OpenAI API для анализа текста
- **Валидация**: Pydantic модели

### 5.2 Структура проекта
```
dor-checker/
├── dor_checker/         # Backend модуль
│   ├── main.py          # FastAPI приложение
│   ├── database.py      # Работа с SQLite
│   ├── models.py        # Pydantic модели
│   └── ai_analyzer.py   # Логика проверки с AI
├── frontend/            # React фронтенд
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── pages/       # Страницы приложения
│   │   ├── hooks/       # Кастомные хуки
│   │   ├── services/    # API сервисы
│   │   └── types/       # TypeScript типы
│   ├── package.json
│   └── vite.config.ts
├── dor_checker.db       # SQLite база
├── requirements.txt     # Python зависимости
└── pyproject.toml       # Конфигурация проекта
```

### 5.3 Frontend (React + TypeScript)
- **Framework**: React 18 с TypeScript
- **Сборщик**: Vite
- **Стили**: TailwindCSS
- **Маршрутизация**: React Router
- **Формы**: React Hook Form
- **HTTP клиент**: Axios
- **Иконки**: Heroicons

#### Функционал:
- Управление DoR (создание, редактирование, удаление, просмотр)
- Проверка задач с выбором DoR
- Отображение результатов с цветовой индикацией
- Адаптивный дизайн
- Обработка ошибок и состояний загрузки

## 6. Дополнительные требования

### 6.1 Обработка ошибок
- Валидация входных данных
- Корректная обработка отсутствующих DoR
- Лимиты на длину текста задачи (макс 5000 символов)
- Обработка ошибок AI API

### 6.2 Начальные данные
При первом запуске создать несколько стандартных DoR:
- General Task DoR
- Backend Task DoR  
- Frontend Task DoR
- Bug Fix DoR

### 6.3 Конфигурация
```python
# config.py
OPENAI_API_KEY = "..."
MAX_TASK_LENGTH = 5000
DATABASE_PATH = "dor_checker.db"
```

## 7. Запуск приложения

### 7.1 Backend
```bash
# Установка зависимостей
uv sync

# Запуск сервера
uv run python -m dor_checker

# Или через uvicorn
uv run uvicorn dor_checker.main:app --reload --port 8000
```

### 7.2 Frontend
```bash
# Переход в директорию фронтенда
cd frontend

# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
```

### 7.3 Полный запуск
1. Запустите backend на порту 8000
2. Запустите frontend на порту 3000
3. Откройте http://localhost:3000 в браузере

Vite автоматически проксирует API запросы с `/api/*` на backend сервер.

## 8. Примеры промптов для AI

```python
def create_check_prompt(criterion: str, task_text: str) -> str:
    return f"""
    Проверь, выполняется ли следующий критерий DoR в тексте задачи.
    
    Критерий: {criterion}
    
    Текст задачи:
    {task_text}
    
    Ответь в формате JSON:
    {{
        "passed": true/false,
        "comment": "Короткий комментарий что добавить или почему критерий выполнен"
    }}
    """
```