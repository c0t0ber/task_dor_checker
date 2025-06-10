# DoR Checker Backend - Инструкция по запуску

## Установка зависимостей

```bash
cd backend
just update-deps
```

## Настройка переменных окружения

Создайте файл `.env` в корне папки `backend` со следующим содержимым:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Замените `your_openai_api_key_here` на ваш реальный API ключ от OpenAI.

## Запуск сервера

```bash
# Из папки backend
uv run python -m dor_checker
```

Сервер запустится на `http://localhost:8000`

## Проверка работы

```bash
# Проверка здоровья сервера
curl http://localhost:8000/health

# Получение всех чек-листов
curl http://localhost:8000/api/checklists

# Получение текущего промпта
curl http://localhost:8000/api/prompt
```

## API Документация

После запуска сервера документация API доступна по адресам:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Структура проекта

```
backend/
├── dor_checker/
│   ├── __init__.py
│   ├── __main__.py          # Точка входа
│   ├── main.py              # FastAPI приложение
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py        # API роуты
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic модели
│   ├── services/
│   │   ├── __init__.py
│   │   ├── openai_service.py    # Сервис для работы с OpenAI
│   │   └── storage_service.py   # Сервис для работы с JSON файлами
│   └── data/
│       ├── checklists.json      # Хранилище чек-листов
│       └── prompt.json          # Хранилище промпта
├── pyproject.toml
├── requirements.txt
└── justfile
```

## Команды разработки

```bash
# Форматирование кода
just fmt

# Проверка линтером
just lint

# Обновление зависимостей
just update-deps
``` 