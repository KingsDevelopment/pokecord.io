'use strict';

const commander = require('commander');

const run = async () => {
	// setup commander
	commander
	.version('0.1.0')
	.option('-s, --scrape', 'Run scrape job')
	.option('-f, --force', 'Run scrape job without cache')
	.option('-b, --bot', 'Run bot')
	.parse(process.argv);

	let showHelp = true;
	if(commander.scrape) {
		showHelp = false;
		const scrape = require('./lib/scrape');
		await scrape(commander.force);
	}

	if(commander.bot) {
		const checkConfig = require('./lib/config');
		checkConfig();

		showHelp = false;
		const bot = require('./lib/bot');
		bot();
	}

	if(showHelp) {
		commander.outputHelp();
	}
}


run();