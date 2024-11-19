#!/bin/sh

echo "Starting project(critical bank)"

echo "Start local network"

docker network create critical-bank-net

if [ $? -ne 0 ] 
then 
  echo "Successful create network!"
else
  echo "Local network already created!"
fi

echo "Start database postgresql"

sudo docker compose -f ./docker/pg.docker-compose.yml --env-file ./envs/typeorm.env up -d

echo "Start mongodb"

sudo docker-compose -f ./docker/mongo.docker-compose.yml --env-file ./envs/mongo.env up -d

echo "Start kafka"

sudo docker compose -f ./docker/msg-broker.docker-compose.yml --env-file ./envs/msg-broker.env up -d

echo "Start logging system"

docker volume create prometheus_data
docker volume create critical-grafana

sudo docker-compose -f ./docker/logs.docker-compose.yml --env-file ./envs/logs.env up -d

echo "Start Microservices!!!"

echo "Start apigateway"

sudo docker-compose -f ./docker/apigateway.docker-compose.yml --env-file ./envs/apigateway.env up -d --build