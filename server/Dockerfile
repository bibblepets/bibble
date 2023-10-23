FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json .

COPY ../data/*.csv ./data

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]