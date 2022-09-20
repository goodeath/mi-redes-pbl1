#!/bin/bash
docker run --rm --name hidrometer -e SERVER_HOST=172.17.0.1 -e SERVER_PORT=9091 -e PORT=9090 -p 15000:9090 -it goodeath/hidrometer:v1.0.1