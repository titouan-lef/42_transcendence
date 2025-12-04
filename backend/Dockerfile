FROM node:24

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN mkdir -p ./pictures

RUN npm run format:check
RUN npm run build

ENTRYPOINT ["/app/check_and_build.sh"]

CMD ["npm", "start"]
