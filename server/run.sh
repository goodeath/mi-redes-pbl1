#!/bin/bash
docker run --rm --name hidrometer-server -p 9091:9091 -p 9092:9092 -it goodeath/server:v1.0.1