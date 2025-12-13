# ======================
# Base
# ======================
FROM node:24 AS base
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# ======================
# Development
# ======================
FROM base AS dev
RUN mkdir -p ./backups/pictures
ENTRYPOINT ["/app/check_and_build.sh"]
CMD ["npm", "start"]

# ======================
# Production
# ======================
FROM base AS prod
RUN npm run format:check
RUN npm run build
CMD ["npm", "start"]
