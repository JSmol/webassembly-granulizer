#!/bin/bash
set -ex

# NOTE: this only builds the rust/webassebly 🔧
cargo +nightly build --workspace --target=wasm32-unknown-unknown

# NOTE: The main wasm module is bundled by webpack 📦.
wasm-bindgen target/wasm32-unknown-unknown/debug/wasm.wasm \
  --out-dir=wasm/ \
  --target=bundler

# For a more graceful import syntax
test -f wasm/wasm.js && mv wasm/wasm.js wasm/index.js 
test -f wasm/wasm.d.ts && mv wasm/wasm.d.ts wasm/index.d.ts 

# NOTE: The wasm-bindgen command outputs .wasm and .js files, the .js file allows for easy loading of the corresponding .wasm.
# Since we are using webpack to bundle and minify javascript, we would like to have the javascript be in the same folder as the worklets and typescript code for bundling purposes.
# On the other hand, the wasm will not be bundled by webpack since it is loaded dynamically and passed to the worklet during runtime, therefore we store the .wasm in the /public/wasm/ directory.

wasm-bindgen target/wasm32-unknown-unknown/debug/sampler.wasm \
  --out-dir=sampler/ \
  --target=web \
  --omit-default-module-path \
  --no-typescript

# NOTE: load the wasm in the sampler worklet with:
# import { initSync, WasmSampler } from "./wasm";
# ... initSync(*module*) where *module* is the dynamically loaded wasm binary found at public/wasm/sampler.wasm.
[ ! -d public/wasm ] && mkdir public/wasm
test -f sampler/sampler.js && mv sampler/sampler.js sampler/wasm.js
test -f sampler/sampler_bg.wasm && mv sampler/sampler_bg.wasm public/wasm/sampler.wasm

# NOTE: the rest of the wasm worklets work similar to `sampler`
wasm-bindgen target/wasm32-unknown-unknown/debug/oscilloscope.wasm \
  --out-dir=oscilloscope/ \
  --target=web \
  --omit-default-module-path \
  --no-typescript

test -f oscilloscope/oscilloscope.js && mv oscilloscope/oscilloscope.js oscilloscope/wasm.js
test -f oscilloscope/oscilloscope_bg.wasm && mv oscilloscope/oscilloscope_bg.wasm public/wasm/oscilloscope.wasm

