FROM node:18-bullseye-slim

RUN mkdir /app
WORKDIR /app
ADD . /app
ADD package.json /app
ADD package-lock.json /app

RUN apt-get update && apt-get install -y fonts-dejavu && npm install && npm run build

EXPOSE 3000
ENTRYPOINT ["npm", "run", "bot"]
