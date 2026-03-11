# --- Build stage: install deps + generate Prisma client ---
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

# --- Production stage: lean runtime image ---
FROM node:20-alpine

RUN apk add --no-cache openssl wget \
    && addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy generated Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY prisma ./prisma
COPY src ./src

USER appuser

EXPOSE 15011

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
