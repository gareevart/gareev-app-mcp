# Publishing Guide

Пошаговое руководство по публикации вашего MCP сервера для всеобщего использования.

## 🚀 Быстрая публикация

### Шаг 1: Подготовка

1. **Обновите package.json:**
   ```bash
   # Замените @your-username на ваш npm username или организацию
   sed -i '' 's/@gareev/@gareev/g' package.json
   sed -i '' 's/gareev/gareev/g' package.json
   sed -i '' 's/Dmitrii/Dmitrii Gareev/g' package.json
   sed -i '' 's/gareev.da92@gmail.com/gareev.da92@gmail.com/g' package.json
   ```

2. **Проверьте готовность:**
   ```bash
   ./publish-check.sh
   ```

### Шаг 2: Создание GitHub репозитория

1. Создайте новый репозиторий на GitHub
2. Инициализируйте git и загрузите код:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Gareev App MCP Server"
   git branch -M main
   git remote add origin https://github.com/gareevart/gareev-app-mcp.git
   git push -u origin main
   ```

### Шаг 3: Настройка автоматической публикации

1. **Получите NPM токен:**
   - Зайдите на [npmjs.com](https://www.npmjs.com/)
   - Перейдите в Account → Access Tokens
   - Создайте новый токен с правами "Automation"

2. **Настройте GitHub Secrets:**
   - В вашем GitHub репозитории: Settings → Secrets and variables → Actions
   - Добавьте секрет `NPM_TOKEN` со значением вашего npm токена

### Шаг 4: Публикация

**Вариант A: Автоматическая публикация через GitHub**
```bash
# Создайте релиз на GitHub
git tag v0.1.0
git push origin v0.1.0
# Или используйте GitHub UI для создания релиза
```

**Вариант B: Ручная публикация**
```bash
npm login
npm publish --access public
```

## 📦 Альтернативные способы распространения

### 1. NPX (рекомендуется)
После публикации в npm пользователи смогут использовать:
```bash
npx @your-username/supabase-app-mcp-server
```

### 2. Глобальная установка
```bash
npm install -g @your-username/supabase-app-mcp-server
```

### 3. Скрипт установки
Пользователи смогут использовать одну команду:
```bash
curl -fsSL https://raw.githubusercontent.com/your-username/supabase-app-mcp-server/main/install.sh | bash
```

### 4. Docker (опционально)
Создайте Dockerfile для контейнеризации:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY build/ ./build/
EXPOSE 3000
CMD ["node", "build/index.js"]
```

## 🔧 Настройка для пользователей

### Автоматическая настройка
Скрипт `install.sh` автоматически:
- Устанавливает пакет
- Находит файл настроек MCP
- Запрашивает учетные данные Supabase
- Обновляет конфигурацию MCP
- Тестирует подключение

### Ручная настройка
Пользователи добавляют в MCP settings:
```json
{
  "mcpServers": {
    "supabase-app-server": {
      "disabled": false,
      "type": "stdio",
      "command": "npx",
      "args": ["@your-username/supabase-app-mcp-server"],
      "env": {
        "SUPABASE_URL": "https://user-project.supabase.co",
        "SUPABASE_ANON_KEY": "user-anon-key",
        "APP_BASE_URL": "http://localhost:3000"
      }
    }
  }
}
```

## 📈 Мониторинг и обновления

### GitHub Actions
Настроенные workflows:
- **CI:** Тестирование на каждый push/PR
- **Publish:** Автоматическая публикация при создании релиза

### Версионирование
Используйте семантическое версионирование:
```bash
npm version patch  # 0.1.0 → 0.1.1 (багфиксы)
npm version minor  # 0.1.0 → 0.2.0 (новые функции)
npm version major  # 0.1.0 → 1.0.0 (breaking changes)
```

### Обновления
Для выпуска новой версии:
1. Внесите изменения в код
2. Обновите CHANGELOG.md
3. Создайте новый релиз на GitHub
4. GitHub Actions автоматически опубликует в npm

## 🌐 Продвижение

### 1. Документация
- README.md с примерами использования
- USER_GUIDE.md с подробными инструкциями
- Видео-демонстрация (рекомендуется)

### 2. Сообщества
Поделитесь в:
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Model Context Protocol](https://github.com/modelcontextprotocol/servers)
- Reddit: r/supabase, r/programming
- Twitter/X с хештегами #supabase #mcp #ai

### 3. Примеры использования
Создайте демо-видео или GIF показывающие:
- Установку одной командой
- Примеры команд
- Результаты работы

## 🔍 Аналитика

### NPM статистика
Отслеживайте:
- Количество загрузок
- Популярные версии
- География пользователей

### GitHub статистика
Мониторьте:
- Stars и forks
- Issues и PR
- Traffic и клоны

## 🛠️ Поддержка пользователей

### Документация
- Четкие инструкции по установке
- Примеры использования
- Troubleshooting секция

### Обратная связь
- GitHub Issues для багов
- GitHub Discussions для вопросов
- Быстрые ответы на проблемы

### Обновления
- Регулярные обновления безопасности
- Новые функции по запросам пользователей
- Совместимость с новыми версиями зависимостей

## ✅ Чек-лист публикации

- [ ] Обновлен package.json с реальными данными
- [ ] Создан GitHub репозиторий
- [ ] Настроен NPM_TOKEN в GitHub Secrets
- [ ] Протестирована сборка и запуск
- [ ] Обновлена документация
- [ ] Создан первый релиз
- [ ] Протестирована установка пользователями
- [ ] Опубликовано в сообществах

## 🎯 Результат

После выполнения всех шагов ваш MCP сервер будет:

✅ **Доступен всем пользователям** через npm
✅ **Легко устанавливается** одной командой  
✅ **Автоматически обновляется** через GitHub Actions
✅ **Хорошо документирован** для пользователей
✅ **Готов к масштабированию** и развитию

Пользователи смогут просто выполнить:
```bash
curl -fsSL https://raw.githubusercontent.com/your-username/supabase-app-mcp-server/main/install.sh | bash
```

И сразу начать использовать ваш MCP сервер! 🚀
