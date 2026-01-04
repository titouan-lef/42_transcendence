# ======================
# Base
# ======================
FROM node:24 AS base
WORKDIR /app
RUN mkdir -p ./backend/src
COPY package.json eslint.config.js check_and_build.sh check_and_build.dev.sh .
COPY tsconfig.json ./backend/
RUN npm install
COPY src ./backend/src

# ======================
# Development
# ======================
FROM base AS dev
RUN mkdir -p ./backups/pictures
COPY check_and_build.dev.sh .
ENTRYPOINT ["/app/check_and_build.dev.sh"]
CMD ["npm", "start"]

# ======================
# Production
# ======================
FROM base AS prod
# Build needs the files in the `shared` volume, so we cannot build the TS during the container building time, but only during running time.
COPY check_and_build.sh .
ENTRYPOINT ["/app/check_and_build.sh"]
CMD ["npm", "start"]
