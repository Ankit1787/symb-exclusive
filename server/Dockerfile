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

EXPOSE 5001

CMD ["npm", "run", "dev"]

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

COPY package*.json ./

RUN npm ci --omit=dev

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy markdown skills
COPY --from=builder /app/src/ai/skills ./src/ai/skills

EXPOSE 5001

CMD ["node", "dist/index.js"]