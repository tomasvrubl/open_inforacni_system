#!/bin/bash

GR='\033[0;32m'
NC='\033[0m'

printf "${GR}Vytvarim release npm run build:prod ${NC}";

rm -rf ./app/*

npm run build2
