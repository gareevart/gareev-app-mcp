# Завершение настройки MCP сервера

## Шаг 1: Получение переменных окружения Supabase

Для завершения настройки MCP сервера вам нужно получить переменные окружения из вашего Supabase проекта:

### Вариант 1: Из файла .env.local
Если у вас есть файл `.env.local` в корне проекта, найдите в нем:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Вариант 2: Из Supabase Dashboard
1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Settings** → **API**
4. Скопируйте:
   - **Project URL** → это ваш `SUPABASE_URL`
   - **anon public** → это ваш `SUPABASE_ANON_KEY`

## Шаг 2: Обновление конфигурации MCP

Откройте файл конфигурации MCP:
```
/Users/username/../../settings/mcp_settings.json
```

Добавьте секцию `"supabase-app-server"` и замените плейсхолдеры:

```json
{
  "mcpServers": {
    "gareev-app-mcp": {
      "env": {
        "SUPABASE_URL": "https://your-actual-project.supabase.co",
        "SUPABASE_ANON_KEY": "your-actual-anon-key-here",
        "APP_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

## Шаг 3: Тестирование сервера

Запустите тестовый скрипт для проверки работы сервера:

```bash
cd /Users/username/you_directory/gareev-app-mcp
node run-mcp.js
```

Если все настроено правильно, вы увидите сообщение "✅ Server started successfully!"

## Шаг 4: Перезапуск системы MCP

После обновления конфигурации перезапустите VS Code или систему MCP для применения изменений.

## Шаг 5: Проверка доступности инструментов

После успешной настройки у вас будут доступны следующие инструменты:

- `get_blog_posts` - Получение блог-постов
- `create_blog_post` - Создание нового поста
- `get_broadcasts` - Получение рассылок
- `get_subscribers` - Получение подписчиков
- `get_broadcast_groups` - Получение групп рассылки
- `get_user_profiles` - Получение профилей пользователей
- `get_images` - Получение изображений
- `get_app_stats` - Статистика приложения

## Примеры использования

После настройки вы можете использовать команды:

```
Покажи статистику приложения
```

```
Получи последние 5 блог-постов
```

```
Покажи всех активных подписчиков
```

## Устранение неполадок

### Ошибка "Cannot find module"
- Убедитесь, что выполнили `npm run build` в папке сервера

### Ошибка подключения к Supabase
- Проверьте правильность SUPABASE_URL и SUPABASE_ANON_KEY
- Убедитесь, что проект Supabase активен

### Сервер не отвечает
- Проверьте, что приложение запущено на указанном APP_BASE_URL
- Убедитесь, что нет конфликтов портов

## Дополнительные возможности

Для расширенных возможностей (например, создания постов) добавьте также:
```json
"SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key"
```

Service Role Key можно найти в том же разделе Supabase Dashboard → Settings → API.

⚠️ **Внимание**: Service Role Key имеет полные права доступа к базе данных. Используйте его осторожно.