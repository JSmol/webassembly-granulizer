#!/bin/bash

./clean.sh
npm run build

rm -r bundle
mkdir bundle

cp -r dist/ bundle/dist/
cp -r public/ bundle/public/
cp index.html bundle/index.html
cp style.css bundle/style.css

