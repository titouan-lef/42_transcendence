FROM node:24

WORKDIR /app

COPY package.json ./

RUN npm install --loglevel=error

COPY . .

RUN npm run format:check
RUN npm run build

ENTRYPOINT ["/app/check_and_build.sh"]

CMD ["npm", "start"]
