#!/bin/bash
docker run --rm --name hidrometer-front -e SERVER_HOST=172.17.0.2 -e SERVER_PORT=9092 -p 8080:8080 -it goodeath/hidrometer-front:v1.0.0