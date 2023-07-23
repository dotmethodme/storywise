FROM node:18-alpine3.18

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

COPY api/package.json api/
COPY frontend/package.json frontend/

RUN npm i -w api -w frontend

COPY api api/
COPY frontend frontend/
COPY shared shared/

RUN npm run build

ENTRYPOINT ["npm", "start"]

