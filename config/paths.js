const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd()); // Directory from where the command is run. Eg. npm run webpack might result into entering multiple files. Inside those files logging "__dirName" will refer to the directoey of that file whereas cwd will refer to the dir from where you run the command.
console.log("App Directory: "+ appDirectory);

const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
	root: appDirectory,
	src: resolveApp('src'),
	public: resolveApp('public'),
	appHtml: resolveApp('src/index.html'),
	appJS: resolveApp('src/index.js'),
	bundle: resolveApp('public/bundle.js'),
	node_modules: resolveApp('node_modules'),
}