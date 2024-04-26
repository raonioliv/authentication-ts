FROM node:20.7.0

WORKDIR /app-backend

COPY package* .

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run" ]

CMD [ "dev" ]




