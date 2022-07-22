FROM node:18-alpine
  WORKDIR .
  COPY package*.json ./
  RUN npm install --legacy-peer-deps
  COPY . .
  EXPOSE 4200
CMD [ "ng", "serve" ]
