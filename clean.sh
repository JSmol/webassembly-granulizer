#!/bin/bash
set -ex

# rust
rm -r wasm/
rm -r target/
rm -r public/wasm/

# webpack
rm -r dist/
rm -r public/worklets/

# bundle
rm -r bundle/
