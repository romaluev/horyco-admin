# Базовый образ
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем зависимости
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --legacy-peer-deps

# Копируем остальные файлы
COPY . .

# Собираем приложение
RUN npm run build

# Указываем порт (если используешь кастомный, замени)
EXPOSE 3002

# Запуск
CMD ["npm", "start"]
