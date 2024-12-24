FROM node:18-alpine3.18

RUN npm install -g pnpm @nestjs/cli
RUN apk update && apk add bash
RUN mkdir -p /notifications 
RUN apk add vim

WORKDIR /notifications

COPY package.json /notifications
COPY pnpm-lock.yaml /notifications
COPY --chown=777 . .

RUN pnpm i
RUN nest build notifications
RUN chmod +x ./apps/notifications/start.sh
CMD ["/bin/bash", "-c", "./apps/notifications/start.sh"]
