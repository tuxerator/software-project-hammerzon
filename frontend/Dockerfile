FROM node:latest as node

WORKDIR /app

COPY . .
RUN npm install --legacy-peer-deps

ENV BACKEND_URI = $BACKEND_URI
EXPOSE 4200

RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist/frontend /usr/share/nginx/html

