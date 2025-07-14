FROM node:22-alpine
WORKDIR /compiler
RUN apk update && apk add --no-cache g++ openjdk17 python3
COPY . .
RUN npm install
EXPOSE 8080
CMD ["node", "index.js"]