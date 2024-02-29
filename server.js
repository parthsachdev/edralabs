const express = require('express');
const app = express()
const expressWs = require('express-ws')(app);
const fs = require('fs');
const { watch } = require('node:fs/promises');
const readline = require('node:readline');
const { Stream } = require('stream');
// const { stdin: input, stdout: output } = require('node:process');

// const {logEmitter} = require('./generate-log');

const getLastLine = (fileName, minLength) => {
	let inStream = fs.createReadStream(fileName);
	let outStream = new Stream;
	return new Promise((resolve, reject)=> {
			let rl = readline.createInterface(inStream, outStream);

			let lastLine = '';
			rl.on('line', function (line) {
					if (line.length >= minLength) {
							lastLine = line;
					}
			});

			rl.on('error', reject)

			rl.on('close', function () {
					resolve(lastLine)
			});
	})
}

app.use(express.static('client'));

app.use(function (req, res, next) {
  req.testing = 'testing';
  return next();
});

app.get('/', (req, res, next) => {
	return res.sendFile(__dirname + '/client/index.html');
});


/**
 * I was able to send the real time updates and the client is able
 * to read the lastest update and get the last line
 */
app.ws('/ws', async (ws, req) => {
	ws.on('message', (msg) => {
		console.log(`Connected to client: ${req.ip}, isTrusted: ${JSON.parse(msg).isTrusted}`);
	});

	const logFile = req.query.logFile;

	const stream = fs.createReadStream(logFile, {start: 2});
	stream.on('data', (data) => {
		ws.send(data.toString());
	});

	const watcher = watch(logFile);
    for await (const event of watcher)
			ws.send(await getLastLine(logFile, 1));
});

app.listen(3000);

