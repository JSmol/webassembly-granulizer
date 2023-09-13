# Webassembly Audio Sample Granulizer
[VIDEO](https://youtu.be/lEJ-5T-v-TY)

## Setup
This project uses npm and the rust nightly channel.

## Scripts
### `build.sh`
Compiles all the *rust* and *webassembly* and populates the `wasm/` and `public/wasm/` folders.
The files in `wasm/` are packaged by webpack.
The files in `public/wasm` are treated as static assets.

### `clean.sh`
Removes all files unecessary to build the project, ie: `.wasm` files or the `dist/` folder.

### `bundle.sh`
Builds the project to the `bundle/` folder so it's easier to deploy.

### `npm run build`
Runs `build.sh` and uses `webpack` to build the project.

### `npm run serve`
Runs `node server.js` to host the project after it has been built.

### `npm run watch`
Runs `webpack --watch`.
*NOTE* Webpack watches for changes in rust files, but does not compile them.
In order to see changes made to the rust code, the webassembly must be rebuilt by calling `./build.sh`.

