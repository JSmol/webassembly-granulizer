const path = require('path');

// bundle the main application and main application wasm
app_config = {
  entry: {
    main: './main.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  target: "web",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // {
      //   test: /\.wasm$/,
      //   type: "asset/resource",
      // },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  },
  mode: "development",
};

// bundle worklets
const worklet_config = {
  entry: {
    sampler: './sampler/worklet.js',
    oscilloscope: './oscilloscope/worklet.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: "worklets/[name].js"
  },
  target: "webworker",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ],
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  },
  mode: "development",
};

module.exports = [
  app_config,
  worklet_config
];

