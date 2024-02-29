const fs = require('fs');

fs.writeFileSync('log-1', '');

let i = 0;

setInterval(() => {
	const log = `${new Date().toISOString()} log data ${i}`;
	fs.appendFileSync('log-1', log + '\n');
	i++;
}, 2000);

