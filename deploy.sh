#!/bin/sh

cd ./frontend;
echo "Building the Frontend...";
npm install --legacy-peer-deps > /dev/null;
npm run build;

cd ../backend;
echo "Dockerizing Backend + Frontend...";
docker build . -t hammerzon-backend > /dev/null;
cd ../;

docker compose up;

