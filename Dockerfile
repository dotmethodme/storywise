FROM node:22-alpine3.19 AS build-frontend

WORKDIR /app

COPY frontend/package.json /app
COPY frontend/package-lock.json /app

RUN npm install

COPY frontend /app

RUN npm run build

FROM golang:1.22-bookworm AS build-backend

WORKDIR /app

COPY backend/ /app/
COPY --from=build-frontend /app/dist /app/dist-frontend

RUN go build -o /app/backend /app/main.go

RUN ls -lah


ENTRYPOINT ["/app/backend"]
