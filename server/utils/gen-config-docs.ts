import { configDocs } from "../lib/config/config";
import { writeFile } from "fs/promises";

function formatJson(data) {
  return `\`${data.replace(/\n/g, "")}\``;
}

let data = `# Ejtimaa Server Configuration

The server configuration file can use one of the following formats:

- config/config.json
- config/config.json5
- config/config.yaml
- config/config.yml
- config/config.toml

Example \`config.yaml\`:

\`\`\`yaml
redisOptions:
  host: redis
  port: 6379

listeningPort: 3443
\`\`\`

Additionally, a \`config/config.js\` can be used to override specific properties
with runtime generated values and to set additional configuration functions and classes.
Look at the default \`config/config.example.js\` file for documentation.

## Configuration properties

| Name | Description | Format | Default value |
| :--- | :---------- | :----- | :------------ |
`;

Object.entries(configDocs).forEach((entry: [string, any]) => {
  const [name, value] = entry;

<<<<<<< HEAD
  data += `| ${name} | ${value.doc} | ${formatJson(
    value.format
  )} | \`${formatJson(value.default)}\` |\n`;
=======
	// escape dynamically created default values
	switch (name)
	{
		case 'mediasoup.webRtcTransport.listenIps':
			value.default = '[ { "ip": "0.0.0.0", "announcedIp": null } ]';
			break;
		case 'mediasoup.numWorkers':
			value.default = '4';
			break;
	}

	data += `| ${name} | ${value.doc} | ${formatJson(value.format)} | \`${formatJson(value.default)}\` |\n`;
>>>>>>> 61db9e3739921df6b2cf6edca4cefbaf55eb3796
});

data += `

---

*Document generated with:* \`yarn gen-config-docs\`
`;

<<<<<<< HEAD
writeFile("README.md", data).then(
  () => {
    console.log("done"); // eslint-disable-line
  },
  (err) => {
    console.error(`Error writing file: ${err.message}`); // eslint-disable-line
  }
);
=======
writeFile('config/README.md', data).then(() =>
{
	console.log('done'); // eslint-disable-line
}, (err) =>
{
	console.error(`Error writing file: ${err.message}`); // eslint-disable-line
});
>>>>>>> 61db9e3739921df6b2cf6edca4cefbaf55eb3796
