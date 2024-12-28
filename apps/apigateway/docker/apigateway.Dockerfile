FROM node:18-alpine3.18

RUN npm install -g pnpm @nestjs/cli
RUN apk update && apk add bash
RUN mkdir -p /apigateway 

WORKDIR /apigateway

COPY package.json /apigateway
COPY pnpm-lock.yaml /apigateway
COPY --chown=777 . .

RUN pnpm i
RUN nest build apigateway
RUN chmod +x ./apps/apigateway/start.sh
CMD ["/bin/bash", "-c", "./apps/apigateway/start.sh"]
