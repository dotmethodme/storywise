FROM node:18-alpine3.18

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

COPY api/package.json api/
COPY frontend/package.json frontend/


COPY api api/
COPY frontend frontend/

RUN npm ci
RUN npm run build

ENTRYPOINT ["npm", "start"]

