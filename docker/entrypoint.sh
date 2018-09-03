#!/bin/bash
npm install
if [ -z "$@" ]
then
    npm start
else
    npm "$@"
fi
