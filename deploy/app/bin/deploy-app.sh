#!/usr/bin/env bash
cd "$( dirname "${BASH_SOURCE[0]}" )"/../

read -p "App to deploy: api | web: " appname

helm upgrade --install "apps-$appname" ./ --namespace nlp \
  --set appname=$appname \
  --set imagesVersion="$(git rev-parse --verify HEAD)" \
  -f ./values/values.yml
