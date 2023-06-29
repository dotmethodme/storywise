FROM node:18-alpine3.18

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci

COPY api api/
COPY frontend frontend/

RUN npm run build

ENTRYPOINT ["npm", "start"]

