#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../../../

version=$(git rev-parse --verify HEAD)
api_image=paralect/common
web_image=paralect/common

echo Prepare api image
docker build -t "$api_image:$version" ./api
docker tag "$api_image:$version" $api_image:latest
docker push "$api_image:$version"

echo Prepare web image
docker build -t "$web_image:$version" ./web
docker tag "$web_image:$version" $web_image:latest
docker push "$web_image:$version"
