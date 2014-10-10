#!/bin/bash

node_modules/.bin/uglifyjs \
  src/coderhunter.js \
  --mangle \
  --compress \
  -o dist/coderhunter.min.js \
  --source-map dist/coderhunter.min.js.map \
  --source-map-url coderhunter.min.js.map 