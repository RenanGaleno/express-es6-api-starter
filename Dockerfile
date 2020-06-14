FROM mhart/alpine-node:12

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]