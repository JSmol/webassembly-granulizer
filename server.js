var liveServer = require("live-server");
var http = require('http');
var fs = require("fs");

var params = {
	port: 8080,
	host: "127.0.0.1", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
  open: false,
	root: ".", // Set root directory that's being served. Defaults to cwd.
	file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
	wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
	logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  https: {
    cert: fs.readFileSync(__dirname + "/keys/cert.pem"),
    key: fs.readFileSync(__dirname + "/keys/key.pem"),
    passphrase: "12345"
  }
	// middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};

// Start the live server
const server = liveServer.start(params);

// Set the Cross-Origin-Opener-Policy header
server.on('request', (_req, res) => {
  // res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
});
