FROM node:16 as node

WORKDIR /app

COPY . .
RUN npm install --legacy-peer-deps

ENV MONGODB_URI = $MONGODB_URI
EXPOSE 80

RUN npm run build --prod
CMD ["npm", "start"]

