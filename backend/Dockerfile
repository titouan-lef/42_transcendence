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
# Build needs the files in the `shared` volume, so we cannot build the TS during the container building time, but only during running time.
ENTRYPOINT ["/app/check_and_build.sh"]
CMD ["npm", "start"]
