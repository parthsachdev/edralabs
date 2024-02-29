const loggerDiv = document.getElementById('logger');
const client = new WebSocket('ws://localhost:3000/ws?logFile=log-1');

client.onopen = (event) => {
	client.send(JSON.stringify(event));
};

client.onmessage = (event) => {
	const logP = document.createElement('p');
	const logStatement = event.data + ' ';
	logP.appendChild(document.createTextNode(logStatement));
	loggerDiv.append(logP);
};
