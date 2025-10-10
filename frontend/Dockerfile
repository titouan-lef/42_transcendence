FROM node:24

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm run format:check
RUN npm run build

ENTRYPOINT ["/app/checkAndBuilt.sh"]

EXPOSE 80

CMD ["npm", "start"]
