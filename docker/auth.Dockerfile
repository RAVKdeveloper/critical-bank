FROM node:18-alpine3.18

RUN npm install -g pnpm @nestjs/cli
RUN apk update && apk add bash
RUN mkdir -p /auth 

WORKDIR /auth

COPY package.json /auth
COPY pnpm-lock.yaml /auth
COPY --chown=777 . .

RUN pnpm i
RUN nest build auth
RUN chmod +x ./apps/auth/start.sh
CMD ["/bin/bash", "-c", "./apps/auth/start.sh"]
