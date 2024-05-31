FROM node:22-alpine3.19 as build-frontend

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

COPY frontend/package.json frontend/

RUN npm i -w frontend

COPY frontend frontend/

RUN npm run build

FROM golang:1.22-bookworm as build-backend

WORKDIR /app

COPY api-go/ /app/
COPY --from=build-frontend /app/frontend/dist /app/dist-frontend

RUN go build -o /app/api-go /app/main.go

RUN ls -lah


ENTRYPOINT ["/app/api-go"]
