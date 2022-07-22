#!/bin/sh

docker-compose down;

echo "Building the Frontend...";
npm install --legacy-peer-deps --production -w frontend > /dev/null;
npm run build --prod -w frontend;

echo "Dockerizing Backend + Frontend...";
docker build . -t hammerzon > /dev/null;

docker-compose up -d;

