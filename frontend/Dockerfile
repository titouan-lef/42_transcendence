# ======================
# Base
# ======================
FROM node:24 AS base
WORKDIR /app
RUN mkdir -p ./frontend/src
COPY package.json eslint.config.js htmlhint.config.js tailwind.config.js .
COPY tsconfig.json tsconfig.build.json ./frontend/
RUN npm install
COPY public ./public
COPY src ./frontend/src

# ======================
# Development
# ======================
FROM base AS dev
RUN mkdir -p ../backups/pictures
COPY check_and_build.dev.sh .
ENTRYPOINT ["/app/check_and_build.dev.sh"]
CMD ["npm", "start"]

# ======================
# Production
# ======================
FROM base AS prod
COPY check_and_build.sh .
# Build needs the files in the `shared` volume, so we cannot build the TS during the container building time, but only during running time.
ENTRYPOINT ["/app/check_and_build.sh"]
CMD ["npm", "start"]
