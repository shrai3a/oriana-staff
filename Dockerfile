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
RUN pnpm install --frozen-lockfile

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

# نسخ patches من builder
COPY --from=builder /app/patches ./patches

# تثبيت dependencies الإنتاجية فقط
RUN pnpm install --prod --frozen-lockfile

# نسخ build النهائي من builder
COPY --from=builder /app/dist ./dist

# نسخ أي ملفات ضرورية مثل config أو assets
COPY --from=builder /app/.env ./ # لو عندك env file

# تعيين PORT
ENV PORT=3000

# Expose port
EXPOSE 3000

# Healthcheck مضبوط
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Start التطبيق
CMD ["node", "dist/index.js"]
