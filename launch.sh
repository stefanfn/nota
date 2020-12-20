#!/bin/bash

CONTAINER_NAME="$(basename $(pwd))"

while (true); do
  docker run -it --rm \
    --name $CONTAINER_NAME \
    -p 6682:6682 \
    nota ./start.sh
  sleep 2
done

