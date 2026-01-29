# ===========================================
# Stage 1: Build
# ===========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_GRAPHQL_URL
ARG VITE_APP_ENV=production

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# Build application
RUN pnpm run build

# ===========================================
# Stage 2: Production
# ===========================================
FROM node:20-alpine

# Install serve globally
RUN npm install -g serve

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

# Start server
CMD ["serve", "-s", ".", "-l", "3000"]
