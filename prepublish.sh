#!/bin/bash

babel --ignore __tests__ --out-dir build src
find ./src -name '*.js' -not -path '*/__tests__*' | \
  while read filepath;
    do cp $filepath `echo $filepath | sed 's/\\/src\\//\\/build\\//g'`.flow;
  done;
