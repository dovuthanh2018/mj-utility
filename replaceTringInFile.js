const fs = require('fs');
const main = async () => {
	const args = require('minimist')(process.argv.slice(2));
	const { endpoint, env} = args;
  // const pathIntl = '/Users/user/.jenkins/workspace/mj-mobile-ios/mj-mobile-ios-build/app/config/intl.ts'
  // const pathAppConfig = '/Users/user/.jenkins/workspace/mj-mobile-ios/mj-mobile-ios-build/app/config/index.ts'
  const pathIntl = '/Users/iosdeveloper/Documents/second/mj-mobile/app/config/intl.ts'
  const pathAppConfig = '/Users/iosdeveloper/Documents/second/mj-mobile/app/config/index.ts'
	if (!fs.existsSync(pathIntl) || !fs.existsSync(pathAppConfig)) {
		console.log('file config not found');
		process.exit();
	}
	console.log(endpoint)
	console.log(env)

	const envText = 'export const env: env';
  const defaultConfigText = 'const defaultConfig'
  const envConfig= env === 'PRODUCTION'? 'PROD_ENV' : 'TEST_ENV';

  //handle intl file
  const intlFileContents = fs.readFileSync(pathIntl, 'utf-8');
	const intlLine = intlFileContents.split(/\r?\n/);
  intlLine.forEach((item) => {
		if(item.toLowerCase().includes('productionendpoint') && item.toLowerCase().includes('http')){
			const index = intlLine.indexOf(item);
      intlLine[index] = "const productionEndpoint = '" + endpoint + "';";
		}
    if(item.toLowerCase().includes('localendpoint') && item.toLowerCase().includes('http')){
      const index = intlLine.indexOf(item);
      intlLine[index] = "const localEndpoint = '" + endpoint + "';";
    }
    if(item.toLowerCase().includes('stagingendpoint') && item.toLowerCase().includes('http')){
      const index = intlLine.indexOf(item);
      intlLine[index] = "const stagingEndpoint = '" + endpoint + "';";
    }
    if(item.toLowerCase().includes('testingendpoint') && item.toLowerCase().includes('http')){
      const index = intlLine.indexOf(item);
      intlLine[index] = "const testingEndpoint = '" + endpoint + "';";
    }
  });
  fs.writeFileSync(pathIntl, intlLine.join("\r\n"));


  //handle intl file
  const configFileContents = fs.readFileSync(pathAppConfig, 'utf-8');
  const configLine = configFileContents.split(/\r?\n/);
  configLine.forEach((item) => {
    if(item.toLowerCase().includes(envText.toLowerCase())){
      const index = configLine.indexOf(item);
      configLine[index] = `export const env: Env = '${env.toLowerCase()}'`;
    }

    if(item.toLowerCase().includes(defaultConfigText.toLowerCase())){
      const index = configLine.indexOf(item);
      configLine[index] = `const defaultConfig = ${envConfig};`;
    }

  });
  fs.writeFileSync(pathAppConfig, configLine.join("\r\n"));
};

main();


// cd mj-mobile-ios-build && node /Users/user/mj-utility/replaceTringInFile.js --path='/Users/user/.jenkins/workspace/mj-mobile-ios/mj-mobile-ios-build/app/config/index.ts'  --findString='productionEndpoint' --replaceString='${server}'