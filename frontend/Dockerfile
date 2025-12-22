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
ENTRYPOINT ["/app/check_and_build.dev.sh"]
CMD ["npm", "start"]

# ======================
# Production
# ======================
FROM base AS prod
# Build need the files in the `sahred` volume, so We cannot build the TS durint the contianer building time, but only during running time.
ENTRYPOINT ["/app/check_and_build.sh"]
CMD ["npm", "start"]
