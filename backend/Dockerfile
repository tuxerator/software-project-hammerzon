FROM node:16 as node

WORKDIR /app

COPY . .
RUN npm install --legacy-peer-deps

EXPOSE 8080

RUN npm run build --prod
CMD ["npm", "start"]

