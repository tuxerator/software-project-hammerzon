FROM node:16 as node

WORKDIR /app

COPY . .
RUN npm install --legacy-peer-deps

ENV BACKEND_URI = $BACKEND_URI
EXPOSE 4200

RUN npm run build --prod
CMD ["npm", "start"]


