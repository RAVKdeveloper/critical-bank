FROM node:18-alpine3.18
RUN npm install -g pnpm @nestjs/cli
RUN apk update && apk add bash
RUN mkdir -p /app/backend 
WORKDIR /app
COPY --chown=777 ./backend /app/backend
WORKDIR /app/backend
RUN pnpm i
# RUN pnpm run api:build
# CMD ["/bin/bash", "-c", "./api.prod.sh"]
