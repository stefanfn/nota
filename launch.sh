#!/bin/bash

CONTAINER_NAME="$(basename $(pwd))"

while (true); do
  docker run --interactive --tty --rm \
    --name $CONTAINER_NAME \
    --hostname $CONTAINER_NAME \
    --publish 6682:6682 \
    nota ./start.sh
  echo "restarting docker container in 2 seconds"
  sleep 2
done

