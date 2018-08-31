'use strict';

const commander = require('commander');

const run = async () => {
	// setup commander
	commander
	.version('0.1.0')
	.option('-s, --scrape', 'Run scrape job')
	.option('-b, --bot', 'Run bot')
	.parse(process.argv);

	let showHelp = true;
	if(commander.scrape) {
		showHelp = false;
		const scrape = require('./lib/scrape');
		await scrape();
	}

	const checkConfig = require('./lib/config');
	checkConfig();

	if(commander.bot) {
		showHelp = false;
		const bot = require('./lib/bot');
		bot();
	}

	if(showHelp) {
		commander.outputHelp();
	}
}


run();