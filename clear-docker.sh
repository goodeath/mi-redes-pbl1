#!/bin/bash
docker rmi hidrometer:v1.0.0
docker build -t hidrometer:v1.0.0 .
