# Coolify Deployment Guide

## Quick Start

### 1. Coolify Setup

1. В Coolify создайте новый проект
2. Добавьте приложение типа **Docker Compose** или **Dockerfile**
3. Подключите GitHub репозиторий

### 2. GitHub Secrets

Добавьте в `Settings > Secrets and variables > Actions`:

| Secret | Описание |
|--------|----------|
| `VITE_API_URL` | URL бэкенд API |
| `VITE_GRAPHQL_URL` | URL GraphQL endpoint |
| `COOLIFY_WEBHOOK_URL_PROD` | Webhook URL из Coolify (production) |
| `COOLIFY_WEBHOOK_URL_STAGING` | Webhook URL из Coolify (staging) |
| `COOLIFY_TOKEN` | API токен Coolify |

### 3. Получение Coolify Webhook

1. Откройте приложение в Coolify
2. Перейдите в **Settings** → **Webhooks**
3. Скопируйте **Deploy Webhook URL**

### 4. Получение Coolify Token

1. Coolify Dashboard → **Settings** → **API Tokens**
2. Создайте токен с правами на deployment

---

## Варианты деплоя

### Вариант A: Автоматический через GitHub Actions (рекомендуется)

Workflow автоматически:
- Запускает lint/type-check
- Собирает Docker образ
- Пушит в GitHub Container Registry
- Триггерит деплой в Coolify

**Триггеры:**
- `main` → Production
- `dev` → Staging

### Вариант B: Прямой деплой из Coolify

1. В Coolify выберите **GitHub** как источник
2. Укажите репозиторий и ветку
3. Coolify автоматически соберёт и задеплоит при push

**Настройки в Coolify:**
```
Build Pack: Dockerfile
Port: 80
Health Check Path: /health
```

### Вариант C: Docker Registry

1. Включите GitHub Actions workflow
2. В Coolify создайте приложение типа **Docker Image**
3. Укажите образ: `ghcr.io/<owner>/<repo>:latest`

---

## Локальная разработка

```bash
# Production build
docker compose up admin

# Development с hot reload
docker compose --profile dev up admin-dev
```

---

## Environment Variables в Coolify

В Coolify → Application → **Environment Variables**:

```env
VITE_API_URL=https://api.production.com
VITE_GRAPHQL_URL=https://api.production.com/graphql
VITE_APP_ENV=production
```

---

## Troubleshooting

### Build fails
- Проверьте что `pnpm-lock.yaml` закоммичен
- Убедитесь что secrets настроены

### Deploy не триггерится
- Проверьте webhook URL
- Проверьте Coolify API token

### 502/504 ошибки
- Проверьте healthcheck: `curl http://localhost/health`
- Посмотрите логи: `docker logs <container>`
