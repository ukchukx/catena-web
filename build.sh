#!/bin/bash
npm install
npm run build
docker build -t catena_web .
