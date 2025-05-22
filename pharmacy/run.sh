#!/usr/bin/env bash

docker build -t pharmacy-filler .

docker run --network="host" pharmacy-filler
