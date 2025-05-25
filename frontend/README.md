# DoR Checker Frontend

React-приложение для проверки задач на соответствие критериям Definition of Ready (DoR).

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev сервер
- **React Router** - маршрутизация
- **React Hook Form** - управление формами
- **Axios** - HTTP клиент
- **TailwindCSS** - стили
- **Heroicons** - иконки

## Установка и запуск

### Установка зависимостей

```bash
cd frontend
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Сборка для продакшена

```bash
npm run build
```

### Просмотр сборки

```bash
npm run preview
```

## Функционал

### Проверка задач
- Выбор DoR из списка
- Ввод текста задачи
- AI анализ соответствия критериям
- Отображение результатов с комментариями

### Управление DoR
- Просмотр списка всех DoR
- Создание новых DoR с критериями
- Редактирование существующих DoR
- Удаление DoR
- Детальный просмотр DoR

## Структура проекта

```
src/
├── components/     # Переиспользуемые компоненты
│   ├── Layout.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/          # Страницы приложения
│   ├── TaskCheck.tsx
│   ├── DorManagement.tsx
│   ├── DorForm.tsx
│   └── DorDetail.tsx
├── hooks/          # Кастомные хуки
│   └── useDors.ts
├── services/       # API сервисы
│   └── api.ts
├── types/          # TypeScript типы
│   └── index.ts
├── App.tsx         # Главный компонент
├── main.tsx        # Точка входа
└── index.css       # Глобальные стили
```

## Конфигурация прокси

Vite настроен на проксирование API запросов к backend серверу:
- Фронтенд: http://localhost:3000
- Backend API: http://localhost:8000
- Прокси: `/api/*` -> `http://localhost:8000/api/*`

## Скрипты

- `npm run dev` - запуск dev сервера
- `npm run build` - сборка для продакшена
- `npm run lint` - проверка ESLint
- `npm run preview` - просмотр сборки 