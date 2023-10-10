const fs = require('fs');
const main = async () => {
	const args = require('minimist')(process.argv.slice(2));
	const { path, findString, replaceString} = args;
	console.log(findString);
	if (!fs.existsSync(path)) {
		console.log('file not found: ' + path);
		process.exit();
	}

	const envText = 'export const env: Env';
	const allFileContents = fs.readFileSync(path, 'utf-8');
	const line = allFileContents.split(/\r?\n/);
	line.forEach((item) => {
		if(item.toLocaleString().includes(findString) && item.toLocaleString().includes('http')){
			const index = line.indexOf(item);
			line[index] = "const productionEndpoint = '" + replaceString + "';";
		}
		if(item.toLocaleString().includes(envText)){
			const index = line.indexOf(item);
			line[index] = "export const env: Env = __DEV__ ? 'dev' : 'production';";
		}

	});

	fs.writeFileSync(path, line.join("\r\n"));
	// const content = await fs.read(path, 'utf8').split('/\\r?\\n/');
	// console.log(content0);
	// const result = content.ind

};

main();
