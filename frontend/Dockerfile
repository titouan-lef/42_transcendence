FROM node:24

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN mkdir -p dist/public && cp node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm dist/public/

RUN npm run format:check
RUN npm run build

ENTRYPOINT ["/app/check_and_build.sh"]

CMD ["npm", "start"]
