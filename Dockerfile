# ===========================
# Build stage
# ===========================
FROM node:22-alpine AS builder

WORKDIR /app

# انسخ package files
COPY package.json pnpm-lock.yaml* ./

# انسخ فولدر patches (ضروري لـ pnpm patch)
COPY patches ./patches

# ثبت pnpm
RUN npm install -g pnpm

# ثبت dependencies كاملة
RUN pnpm install --no-frozen-lockfile 1

# انسخ باقي المشروع
COPY . .

# Build المشروع (لو فيه build step)
RUN pnpm build

# ===========================
# Production stage
# ===========================
FROM node:22-alpine

WORKDIR /app

# تثبيت pnpm
RUN npm install -g pnpm

# نسخ package files من builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# نسخ patches من builder (ضروري للـ patched dependencies)
COPY --from=builder /app/patches ./patches

# تثبيت dependencies الإنتاجية فقط
RUN pnpm install --prod --frozen-lockfile

# نسخ build النهائي من builder
COPY --from=builder /app/dist ./dist

# تعيين PORT
ENV PORT=3000

# Expose port
EXPOSE 3000

# Healthcheck on /health endpoint
HEALTHCHECK --interval=30s --start-period=10s --timeout=15s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

