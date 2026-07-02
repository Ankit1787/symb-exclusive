############################
# Base
############################
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

############################
# Development
############################
FROM base AS development

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

############################
# Builder
############################
FROM base AS builder

RUN npm run build

############################
# Production
############################
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]