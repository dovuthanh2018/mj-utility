const fs = require('fs');
var store = require('app-store-scraper');
const main = async () => {
	store.app({id: 1488637292}).then((result)=> {

		const args = require('minimist')(process.argv.slice(2));
		const { path} = args;
		if (!fs.existsSync(path)) {
			console.log('file not found: ' + path);
			process.exit();
		}

		const currentVersion = (result.version);
		const versionString = currentVersion.replaceAll('.', '');
		const versionNumber = Number(versionString);
		const newVersion = versionNumber + 1;
		const newVersionString = newVersion.toString();
		let newVersionArray = [];
		for (let i = 0; i < newVersionString.length; i++) {
			newVersionArray.push(newVersionString.charAt(i));
		}
		const newVersionApply = newVersionArray.join('.')
		console.log(newVersionApply);

		//get current version
		const allFileContents = fs.readFileSync(path, 'utf8');
		const line = allFileContents.split('\n');
		const marketingText = line.find(item => item.toUpperCase().includes('MARKETING_VERSION'))
		const noSpecialCharacters = marketingText.replace(/[^a-zA-Z0-9 ]/g, '');
		const currentVersionString = (noSpecialCharacters).replaceAll('MARKETINGVERSION','').trim();
		const currentVersionNumber = Number(currentVersionString);
		if(currentVersionNumber < versionNumber){
			console.log('APPLYING NEW MARKETING_VERSION');
			line.forEach((item) => {
				if(item.toLocaleString().includes('MARKETING_VERSION')){
					const arrayString = item.split('=');
					if(arrayString.length === 2){
						arrayString[1] = " " + newVersionApply + ';';
					}
					const index = line.indexOf(item);
					line[index] = arrayString.join('=');
					console.log(line[index]);
				}
			});
			fs.writeFileSync(path, line.join("\r\n"));
		}
	}).catch(console.log);
};

main();


// cd mj-mobile-ios-build && node /Users/user/mj-utility/replaceTringInFile.js --path='/Users/user/.jenkins/workspace/mj-mobile-ios/mj-mobile-ios-build/app/config/index.ts'  --findString='productionEndpoint' --replaceString='${server}'